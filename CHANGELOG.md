# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.0.0]: https://github.com/matinfo/vitepress-plugin-quiz/releases/tag/v1.0.0
