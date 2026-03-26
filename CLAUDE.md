# CLAUDE.md

This is the official OpenAll License repository — the license text, the openall.fund website, and the project's own process materials. This project is itself licensed under the OpenAll License v1.0.

## OpenAll Compliance (READ FIRST)

You are working in an OpenAll-licensed project. **Full instructions are in `.openall/AGENT.md`.** The short version:

1. **Record your conversation** to `/process/conversations/YYYY-MM-DD-short-description.md` before you're done. Always include timezone in the header (e.g., `UTC+8, Asia/Shanghai`).
2. **Record significant decisions** to `/process/decisions/NNN-short-title.md`.
3. **Update the journal** in `/process/journal/` if you accomplish something meaningful.
4. **Sanitize** all process materials before committing — no API keys, passwords, tokens, or third-party personal info. Log to `/process/sanitization.log`.
5. **The meta-process counts.** Recording process materials is itself part of the process. Record it.

Do NOT wait for the human to remind you. This is your responsibility.

## Project Structure

```
├── src/App.jsx          ← Single-file React app (the entire website)
├── src/main.jsx         ← React entry point
├── index.html           ← Vite HTML entry
├── vite.config.js       ← Vite config
├── package.json         ← React 19 + Vite 8
├── LICENSE              ← OpenAll License v1.0 full text
├── .openall/
│   ├── AGENT.md         ← Full AI agent instructions (all AI tools)
│   └── config.json      ← Machine-readable OpenAll config
├── process/             ← All OpenAll process materials
│   ├── conversations/   ← AI interaction logs (auto-generated)
│   ├── decisions/       ← Architecture & design decision records
│   ├── journal/         ← Development progress notes
│   ├── inspirations/    ← References & prior art
│   └── sanitization.log ← Redaction audit trail
```

## Tech Stack

- **React 19** + **Vite 8**, single-page app
- No router — `src/App.jsx` is the entire site
- No CSS files — all styles are inline JS objects in App.jsx
- No backend — static site only

## Development

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build
npm run lint       # ESLint
```

## Deployment

The site deploys as static files from `dist/` after `npm run build`. Currently targeting GitHub Pages from the `gh-pages` branch. Run `npm run build` and deploy the `dist/` directory.

## Key Conventions

- The website is a single React component in `src/App.jsx`. Keep it that way unless there's a strong reason to split.
- All colors are defined as constants at the top of App.jsx (`ACCENT`, `DARK`, `WARM`, etc.).
- License sections are structured as data (`LICENSE_SECTIONS` array) and rendered programmatically.
- The email subscription form points to Buttondown (username: `openall`).
- Social sharing buttons use pre-filled URLs with the #OpenAll hashtag.
- All timestamps in process materials must include timezone (IANA format).

## Repository

- Remote: https://github.com/openall-foundation/openall-license
- Branch: `main`
