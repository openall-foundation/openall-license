# OpenAll — Open Source Your Thinking

[![OpenAll License v1.0](https://img.shields.io/badge/license-OpenAll%20v1.0-1a6b4f)](./LICENSE)

**The first license that requires transparency of the entire creative process — not just the code.**

Traditional open source asks you to share your code. OpenAll asks you to share *how you got there* — every AI conversation, every design decision, every abandoned idea, every source of inspiration. And it asks nothing extra from you: your AI tools handle capture, sanitization, and publishing automatically.

## This is an OpenAll project

This repository is itself licensed under the OpenAll License v1.0. That means the full development process is public:

- **[/process/conversations](/process/conversations)** — AI interaction logs from creating this project
- **[/process/decisions](/process/decisions)** — Key design and architectural decisions
- **[/process/journal](/process/journal)** — Development progress notes
- **[/process/inspirations](/process/inspirations)** — Sources of inspiration and references

## What's in this repo

This is the source code for [openall.fund](https://openall.fund), the official website of the OpenAll License. Built with React + Vite.

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## Adopt OpenAll

1. Copy the [LICENSE](./LICENSE) file into your project
2. Set up the recommended directory structure (`/process/conversations`, `/process/decisions`, `/process/journal`, `/process/inspirations`)
3. Add the badge to your README:

```markdown
[![OpenAll License v1.0](https://img.shields.io/badge/license-OpenAll%20v1.0-1a6b4f)](./LICENSE)
```

4. Add the `openall` topic to your GitHub repo

## Join the movement

- Share with **#OpenAll** on social media
- Browse [#openall projects on GitHub](https://github.com/topics/openall)
- Subscribe to updates at [openall.fund](https://openall.fund)

## For AI agents

This repo includes configuration files that AI coding tools read automatically:

| File | Tool | Purpose |
|------|------|---------|
| `.openall/config.json` | Any AI agent | Machine-readable OpenAll configuration |
| `.openall/AGENT.md` | Any AI agent | Full instructions for compliance |
| `CLAUDE.md` | Claude Code | Auto-detected by Claude Code |
| `.cursorrules` | Cursor | Auto-detected by Cursor IDE |
| `.github/copilot-instructions.md` | GitHub Copilot | Auto-detected by Copilot |

If you adopt OpenAll in your own project, copy the `.openall/` directory and the agent config files. Your AI tools will then know how to maintain process transparency automatically.
