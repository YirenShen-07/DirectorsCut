// All saved screenplay data stays in this browser. No server is used.
const KEY = 'directorsCutScriptsV1';
const TYPES = new Set(['scene-heading','action','character','dialogue','parenthetical','transition']);
const editor = document.querySelector('.script-page');
const notes = document.querySelector('.notes-area');
const title = document.querySelector('#script-title');
const status = document.querySelector('#save-status');
let documents = {}, currentId = null, dirty = false;
const templates = {
 'feature-film': [['scene-heading','INT. COFFEE SHOP - DAY'],['action','A writer opens a notebook beside a cooling cup of coffee.'],['character','SARAH'],['dialogue','Every story starts somewhere.']],
 'episode': [['scene-heading','INT. APARTMENT - MORNING'],['action','A phone rings. Nobody answers.'],['character','ALEX'],['dialogue','That is the third call today.']],
 'rt-film': [['scene-heading','EXT. BUS STOP - NIGHT'],['action','Two strangers wait under a flickering light.'],['character','JAMIE'],['dialogue','Is it still coming?']],
 'stage-play': [['scene-heading','ACT I — A SMALL ROOM'],['action','Two chairs. A letter between them.'],['character','MORGAN'],['dialogue','You should read it first.']]
};
function message(text) { status.textContent = text; }
function stopPlayback() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
function getBlocks() {
 return Array.from(editor.childNodes).map(el => ({type:TYPES.has(el.className)?el.className:'action',text:el.textContent})).filter(block=>block.text.trim());
}
function outline() {
 const list = document.querySelector('.scene-outline'); list.replaceChildren();
 editor.querySelectorAll('.scene-heading').forEach((el,i) => {
  const li=document.createElement('li'), btn=document.createElement('button');
  btn.textContent=el.innerText || `Scene ${i+1}`;
  btn.addEventListener('click',()=>{el.scrollIntoView({block:'center'});editor.focus();});
  li.appendChild(btn);list.appendChild(li);
 });
}
function render(items) {
 editor.replaceChildren();
 items.forEach(item=>{const el=document.createElement('div');el.className=TYPES.has(item.type)?item.type:'action';el.textContent=item.text;editor.appendChild(el);});
 outline();
}
function changed() { dirty=true;message('Unsaved changes');outline(); }
function canReplace() { return !dirty || confirm('Discard unsaved changes?'); }
function recent() {
 const list=document.querySelector('.recent-scripts');list.replaceChildren();
 const entries=Object.entries(documents).sort((a,b)=>b[1].updated.localeCompare(a[1].updated));
 if (!entries.length) {const li=document.createElement('li');li.textContent='No saved scripts yet';list.appendChild(li);}
 entries.forEach(([id,doc])=>{
  const li=document.createElement('li'),btn=document.createElement('button');btn.textContent=doc.title;
  btn.addEventListener('click',()=>{
   if(!canReplace())return;stopPlayback();currentId=id;title.value=doc.title;notes.value=doc.notes;
   render(doc.blocks);document.querySelector('.font-select').value=doc.font;editor.style.fontFamily=doc.font+', Courier, monospace';
   editor.style.fontSize=doc.fontSize;document.querySelector('.font-size').textContent=doc.fontSize;
   dirty=false;message('Loaded saved script');
  });li.appendChild(btn);list.appendChild(li);
 });
}
function newScript() {
 if(!canReplace())return;stopPlayback();currentId=null;title.value='Untitled Script';notes.value='';
 render([{type:'scene-heading',text:'INT. LOCATION - DAY'},{type:'action',text:'Begin your scene here.'}]);changed();
}
function save() {
 const id=currentId || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
 const next={...documents,[id]:{title:title.value.trim()||'Untitled Script',notes:notes.value,blocks:getBlocks(),font:document.querySelector('.font-select').value,fontSize:document.querySelector('.font-size').textContent,updated:new Date().toISOString()}};
 try {localStorage.setItem(KEY,JSON.stringify(next));documents=next;currentId=id;dirty=false;recent();message('Saved in this browser');}
 catch(error) {message('Browser storage unavailable. Download a backup instead.');console.error('Local save failed',error);}
}
function backup() {
 const data={title:title.value,notes:notes.value,blocks:getBlocks()};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download=(data.title.replace(/[^a-z0-9]/gi,'_')||'script')+'.json';
 document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Downloaded JSON backup');
}
function format(label) {
 const type=label.toLowerCase().replaceAll(' ','-');if(!TYPES.has(type))return;
 const selection=window.getSelection();const node=selection.anchorNode;let el=node&&(node.nodeType===1?node:node.parentElement);
 while(el && el.parentElement!==editor)el=el.parentElement;
 if(el && editor.contains(el))el.className=type;
 else {el=document.createElement('div');el.className=type;el.textContent=({'scene-heading':'INT. LOCATION - DAY','action':'Describe the action.','character':'CHARACTER','dialogue':'Write dialogue here.','parenthetical':'(quietly)','transition':'CUT TO:'})[type];editor.appendChild(el);}
 editor.focus();const range=document.createRange();range.selectNodeContents(el);range.collapse(false);selection.removeAllRanges();selection.addRange(range);changed();
}
function play() {
 if(!('speechSynthesis' in window)){message('Text-to-speech unavailable in this browser.');return;}
 stopPlayback();if(!editor.innerText.trim()){message('Write some text first.');return;}
 const utterance=new SpeechSynthesisUtterance(editor.innerText);
 const voices=speechSynthesis.getVoices();if(voices.length)utterance.voice=voices.find(v=>v.default)||voices[0];
 utterance.onend=()=>message(dirty?'Unsaved changes':'Playback finished');
 utterance.onerror=e=>message(['canceled','interrupted'].includes(e.error)?'Playback stopped':'Playback unavailable. Check browser voice availability.');
 speechSynthesis.speak(utterance);message('Reading with browser text-to-speech');
}
editor.addEventListener('input',changed);notes.addEventListener('input',changed);title.addEventListener('input',changed);
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
document.querySelector('.btn-primary').addEventListener('click',newScript);
document.querySelector('.btn-success').addEventListener('click',save);
document.querySelector('.btn-secondary').addEventListener('click',()=>{document.title=title.value.trim()||"Director's Cut";window.print();});
document.querySelector('#download-backup').addEventListener('click',backup);
document.querySelector('.play-dialogue').addEventListener('click',play);
document.querySelector('#stop-dialogue').addEventListener('click',stopPlayback);
document.querySelectorAll('.format-btn').forEach(btn=>btn.addEventListener('click',()=>format(btn.textContent)));
Object.keys(templates).forEach(type=>document.querySelector('.'+type).addEventListener('click',()=>{
 if(!canReplace())return;stopPlayback();currentId=null;title.value='Untitled Script';notes.value='';
 render(templates[type].map(([type,text])=>({type,text})));changed();
}));
document.querySelector('.font-select').addEventListener('change',e=>{editor.style.fontFamily=e.target.value+', Courier, monospace';changed();});
document.querySelector('.font-size').addEventListener('click',e=>{const sizes=['12pt','14pt','16pt'];const next=sizes[(sizes.indexOf(e.target.textContent)+1)%sizes.length];e.target.textContent=next;editor.style.fontSize=next;changed();});
try {documents=JSON.parse(localStorage.getItem(KEY)||'{}');if(!documents||typeof documents!=='object')documents={};}
catch {documents={};message('Saved browser data could not be loaded.');}
recent();outline();
