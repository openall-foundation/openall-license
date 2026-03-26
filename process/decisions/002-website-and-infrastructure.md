# Decision 002: Website and Infrastructure Choices

**Date:** 2026-03-26
**Status:** Accepted
**Participants:** Human founder, Claude (Anthropic)

## Context

The OpenAll License needs an official website and supporting infrastructure.

## Decisions

### License format: Plain text (.txt)
- Chose .txt over .docx or .md for maximum portability
- Any developer can read it in any editor, any terminal, any platform
- Follows the convention of existing licenses (MIT, GPL, Apache all distribute as plain text)

### Website: React + Vite
- Single-page site with inline styles (no external CSS framework)
- Fonts: Source Serif 4 (body), DM Sans (headings), JetBrains Mono (code)
- Color: Deep green (#1a6b4f) as accent — connotes trust, openness, growth
- Two-layer license display: human-readable summary + collapsible legal text (inspired by Creative Commons)

### Email: Buttondown
- Chosen for simplicity, privacy focus, developer-friendly API, and free tier
- Preferred over Mailchimp (too heavy for a community project)

### Domain: openall.fund
- Already purchased by founder
- .fund TLD chosen before deciding not to emphasize foundation branding
- Website content is neutral — does not reference "fund" or "foundation"

## Consequences

- The site is lightweight and can be hosted on any static hosting (Vercel, Netlify, Cloudflare Pages)
- Plain text license is easy to include in any project via copy-paste
- Buttondown needs a registered account with username "openall" to activate the subscribe form
