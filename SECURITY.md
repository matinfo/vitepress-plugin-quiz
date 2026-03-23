# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 1.x | ✅ |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, use [GitHub's private security advisory reporting](https://github.com/matinfo/vitepress-plugin-quiz/security/advisories/new) or send an email to the maintainer.

You can expect an acknowledgement within 48 hours and a patch or mitigation plan within 7 days for critical issues.

## Scope

This plugin processes Markdown at VitePress build time and renders interactive components on the client. The main attack surface is:

- **Markdown parsing:** quiz block content is JSON-encoded and HTML-escaped before being placed in a Vue component attribute. XSS via crafted quiz content should not be possible.
- **sessionStorage:** answer state is stored per path. No server-side data is involved.

If you discover a bypass for either of these, please report it privately.
