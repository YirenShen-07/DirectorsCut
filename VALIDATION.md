# Verified behavior

Verified on 2026-10-13 (UTC) using local Chromium headless rendering and synthetic demonstration text:

- Edit a title, screenplay and notes; save; reload; restore from Recent Scripts; compare the raw stored text and notes.
- Download JSON and verify it contains the edited blocks.
- Invoke browser printing and generate the example screenplay PDF using print CSS.
- Select a template and generate scene navigation from actual headings.
- Exercise playback/stop API calls without JavaScript exceptions. The headless environment has no audible voice, so audible speech was not verified.
- Render desktop and 390-pixel mobile layouts; assert no horizontal overflow; inspect screenshots.

Screenshots and PDF reflect the actual local prototype. They are examples, not usage statistics or user-study findings.
