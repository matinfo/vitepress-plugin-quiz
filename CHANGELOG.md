# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2026-06-28

### Security

- CI: added zizmor pedantic security scan workflow and weekly dependabot config for GitHub Actions.
- CI: hardened all existing workflows — actions pinned to full release SHAs, `persist-credentials: false` on read-only checkouts, write permissions scoped to the single job that needs them, concurrency limits on all workflows, `softprops/action-gh-release` replaced with `gh release create`, and caching disabled in the publish pipeline to prevent cache-poisoning. Zero zizmor findings.
- CI: removed superfluous global `npm install -g npm@11` step (Node 22 ships npm 10.9 which already supports provenance publishing).

## [1.0.4] - 2026-06-28

### Security

- Dependencies: resolved all 11 known advisories in the dependency tree by bumping `esbuild` (≥0.28.1), `vite` (≥6.4.3), `js-yaml` (≥5.2.0) and adding `fast-uri` (≥3.1.2), `lodash` (≥4.18.1), and `postcss` (≥8.5.10) overrides. `bun audit` now reports no vulnerabilities.
- Build/CLI: removed the now-obsolete `--ignore` GHSA flags from the `audit` script since the underlying advisories are fixed rather than suppressed.

## [1.0.3] - 2026-06-21

### Fixed

- Package: aligned project configurations, documentations, and workspace files to use the correct scoped `@matinfo/vitepress-plugin-quiz` package name instead of `vitepress-plugin-quiz`.
- Package: updated integration test-project dependency path to target the correct scoped version tarball, fixing the package extraction/integrity failure on local installation.
- Build/CLI: removed redundant `run` keyword from Bun `--cwd` scripts in `package.json` for proper compatibility.
- Style: resolved outstanding ESLint attribute linebreak warnings in `src/QuizPage.vue`.

## [1.0.2] - 2026-04-05

### Changed

- CI: restructured GitHub Actions workflows for coherence (Proposal B).
  - `ci-plugin.yml`: removed `feature/**`/`fix/**` push triggers (PRs already cover them); added `typecheck` step.
  - `publish-npm.yml`: split into `validate` → `publish` → `github-release` jobs; added `--provenance` flag; automated GitHub Release creation; fixed missing `NODE_AUTH_TOKEN`.
  - `deploy-docs.yml`: removed redundant tag trigger (GitHub Pages only allows deploys from `main`); added `--frozen-lockfile` to install step.
- Chore: `docs/package.json` — removed `version` field (private, never published; version read from root `package.json`).
- Chore: `test-project/package.json` — removed `version` field (private test package).
- Chore: `docs/.vitepress/config.ts` — nav version badge now reads dynamically from root `package.json` instead of a hardcoded string.

## [1.0.1] - 2026-04-05

### Changed

- Docs: added custom VitePress theme (`custom.css`) with a purple brand palette derived from `#A157FE` — sets `--vp-c-brand-1/2/3`, tinted backgrounds, borders, and dividers for both light and dark mode.
- Docs: hero title now renders with a purple-to-lavender gradient via `--vp-home-hero-name-background`.
- Docs: hero logo gains a soft CSS `drop-shadow` glow that matches the brand colour; intensifies on hover.
- Docs: removed the hardcoded `feDropShadow` from `logo.svg` (replaced by CSS glow).
- Docs: `theme-color` meta updated to `#8835fc`.

## [1.0.0] - 2026-03-23

### Added

- `quizMarkdownPlugin` — markdown-it block rule that parses `:::quiz` fenced blocks and emits `<QuizQuestion>` component tags.
- `QuizPage` Vue component — wraps all questions on a page, provides sticky progress bar, Validate button, score display, and Reset. State is shared via Vue `provide/inject`.
- `QuizQuestion` Vue component — renders single-choice, multiple-choice, and fill-in-the-blank questions. Supports Fisher-Yates shuffle, rich inline formatting (`**bold**`, `*italic*`, `` `code` ``), and ARIA accessibility.
- `enhanceAppWithQuiz(app, lang?)` — one-call VitePress integration: registers components, provides locale, and auto-injects styles.
- Built-in locales: `en`, `fr`, `de`, `it`, `es`.
- `getLocale(lang?)` and `locales` exports for programmatic access.
- Full TypeScript support: interfaces `QuizData`, `QuizAnswer`, `QuizLocale`, `QuizState`, `SavedAnswer` exported from the main entry.
- Session persistence via `sessionStorage` — answers and validation state survive SPA navigation.
- Automatic CSS injection — no manual `import "…/quiz.css"` required.
- Dual ESM + CJS build with `vite-plugin-dts`-generated `.d.ts` declarations.
- VitePress docs site deployed to GitHub Pages.
- GitHub Actions workflows for docs deployment (on push to `main`) and npm publish (on `v*` tag).

[1.0.5]: https://github.com/matinfo/vitepress-plugin-quiz/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/matinfo/vitepress-plugin-quiz/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/matinfo/vitepress-plugin-quiz/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/matinfo/vitepress-plugin-quiz/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/matinfo/vitepress-plugin-quiz/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/matinfo/vitepress-plugin-quiz/releases/tag/v1.0.0
