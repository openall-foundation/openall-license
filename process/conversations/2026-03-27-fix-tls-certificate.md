# Conversation: Fix TLS Certificate for openall.world

**Date:** 2026-03-27
**Time:** ~evening (UTC+8, Asia/Shanghai)
**Participants:** Founder (Zhang Yiyi), Claude (Anthropic, Claude Opus 4.6)
**Tool:** Claude Code CLI

> **Note:** This conversation documents the diagnosis and fix of a TLS certificate mismatch error on the project's website (openall.world), deployed via GitHub Pages.

---

## Context

The openall.world website was returning `ERR_TLS_CERT_ALTNAME_INVALID` in browsers — the TLS certificate presented was `*.github.io` instead of one matching `openall.world`. This is a fundamental HTTPS error that undermines the project's credibility.

---

## Transcript

### Problem Report

**Human:** 修复一下：TLS 证书异常 — HTTPS 证书域名不匹配（ERR_TLS_CERT_ALTNAME_INVALID），一个正规项目不应该犯这种基础错误

### Investigation

**Claude:** Explored the project structure and searched for TLS-related configuration. Found:
- The site is a Vite + React static site deployed to GitHub Pages
- Custom domain `openall.world` was configured in GitHub Pages settings
- DNS records correctly pointed to GitHub Pages IPs (`185.199.x.153`)
- **No `CNAME` file existed anywhere in the project**

Without a `CNAME` file in the deployed root, GitHub Pages does not provision a Let's Encrypt certificate for the custom domain. Instead, it serves the default `*.github.io` wildcard certificate, which does not match `openall.world`.

### Fix

**Claude:** Created `public/CNAME` containing `openall.world`. In Vite projects, files in `public/` are copied as-is to `dist/` during build, ensuring the CNAME file is always included in deployments.

### Deployment

**Human:** 你全部自己做

**Claude:** Executed the full deployment:
1. Pulled latest changes from `origin/main`
2. Committed the CNAME file to main branch
3. Pushed to origin — GitHub Actions `deploy.yml` workflow triggered automatically
4. Workflow completed successfully (build + deploy via `actions/deploy-pages@v4`)
5. Verified certificate: initially still `CN=*.github.io`
6. Removed and re-added the custom domain via GitHub API to force certificate re-provisioning
7. Confirmed new certificate: `CN=openall.world`, issued by Let's Encrypt (R13)
8. Enabled `https_enforced: true` via GitHub API for HTTP→HTTPS redirect

### Verification

**Claude:** Direct connection to GitHub Pages IP confirmed:
```
subject: CN=openall.world
issuer: C=US; O=Let's Encrypt; CN=R13
HTTP/2 200
```

---

## Key Decision

No formal decision record needed — this was a straightforward infrastructure fix (missing `CNAME` file), not an architectural or policy decision.

## Files Changed

- `public/CNAME` — **created** — contains `openall.world`, ensures GitHub Pages provisions a valid TLS certificate for the custom domain on every deployment

## Commit

- `3932292` — "Add CNAME file for GitHub Pages custom domain"
