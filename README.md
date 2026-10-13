# Director’s Cut — Screenwriting Web Prototype

A browser-based screenwriting prototype with screenplay formatting, starter templates, font controls, and text-to-speech playback.

## User value
Help writers draft screenplay elements and listen to text from the editor in one interface.

## Implemented features
- Editable screenplay elements and formatting buttons.
- Starter text for feature films, TV episodes, short films, and stage plays.
- Font family and size controls.
- Browser speech synthesis that reads the editor's text.
- Basic document state and an unsaved-change prompt.

## Technology
HTML, CSS, and JavaScript, using DOM events, editable elements, selection/caret APIs, and the browser Speech Synthesis API. Playback uses browser text-to-speech; it is not a generative voice model or character-specific voice system.

## Run locally
1. Clone this repository.
2. Open [screenwriting.html](screenwriting.html) in a browser.
3. Select a template or add formatted elements, edit the text, and use Play Dialogue.

Source: [script.js](script.js) · [styles.css](styles.css)

## Prototype limitations
- Save and PDF export currently display alerts; they do not persist or export a document.
- Character-profile code exists, but its event binding is commented out.
- Scene organization and character-specific voice selection are not established as working features.
- Browser compatibility and a live hosted demo have not been verified.

## Project context and attribution
Duke hackathon portfolio project. Document individual and team contributions before using team-level claims on a resume. No license file is currently included.
