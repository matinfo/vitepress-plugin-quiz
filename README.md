# vitepress-plugin-quiz

[![npm version](https://img.shields.io/npm/v/@matinfo/vitepress-plugin-quiz?style=flat-square&label=npm)](https://www.npmjs.com/package/@matinfo/vitepress-plugin-quiz)
[![downloads](https://img.shields.io/npm/dm/@matinfo/vitepress-plugin-quiz?style=flat-square&label=downloads)](https://www.npmjs.com/package/@matinfo/vitepress-plugin-quiz)
[![CI](https://img.shields.io/github/actions/workflow/status/matinfo/vitepress-plugin-quiz/ci-plugin.yml?branch=main&style=flat-square&label=CI)](https://github.com/matinfo/vitepress-plugin-quiz/actions/workflows/ci-plugin.yml)
[![Publish to npm](https://img.shields.io/github/actions/workflow/status/matinfo/vitepress-plugin-quiz/publish-npm.yml?style=flat-square&label=publish)](https://github.com/matinfo/vitepress-plugin-quiz/actions/workflows/publish-npm.yml)
[![Docs](https://img.shields.io/github/actions/workflow/status/matinfo/vitepress-plugin-quiz/deploy-docs.yml?branch=main&style=flat-square&label=docs)](https://github.com/matinfo/vitepress-plugin-quiz/actions/workflows/deploy-docs.yml)
[![GitHub Pages](https://img.shields.io/badge/docs-live-2ea44f?style=flat-square)](https://matinfo.github.io/vitepress-plugin-quiz/)
[![license](https://img.shields.io/npm/l/@matinfo/vitepress-plugin-quiz?style=flat-square)](https://www.npmjs.com/package/@matinfo/vitepress-plugin-quiz)

A VitePress plugin that adds interactive quizzes to your Markdown pages using a simple `:::quiz` fenced block syntax.

**Features:**
- 📝 Single-choice, multiple-choice, and fill-in-the-blank questions
- 💾 Session persistence — answers survive page navigation
- 🌍 i18n: English, French, German, Italian, Spanish (or bring your own)
- ♿ ARIA roles, keyboard navigation, screen-reader announcements
- 🎨 VitePress CSS variables — dark mode and custom themes work out of the box
- 🚀 Zero runtime dependencies beyond Vue

---

## Quick start

### 1. Install

```sh
# bun
bun add vitepress-plugin-quiz

# npm
npm install vitepress-plugin-quiz
```

### 2. Register the markdown plugin

```ts
// .vitepress/config.ts
import { defineConfig } from "vitepress"
import { quizMarkdownPlugin } from "vitepress-plugin-quiz"

export default defineConfig({
  markdown: {
    config(md) {
      md.use(quizMarkdownPlugin)
    },
  },
})
```

### 3. Register Vue components + auto-inject styles

```ts
// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme"
import { enhanceAppWithQuiz } from "vitepress-plugin-quiz"
import type { Theme } from "vitepress"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithQuiz(app) // English by default; pass "fr", "de", "it", or "es"
  },
} satisfies Theme
```

### 4. Write quizzes in Markdown

```md
:::quiz
question: What does CSS stand for?
answer: Computer Style Sheets
answer-correct: Cascading Style Sheets
answer: Creative Style Sheets
explanation: CSS = **Cascading Style Sheets** — the language that styles web pages.
shuffle: true
:::

:::quiz
question: What CSS property controls text color?
answer-input: color
explanation: The `color` property sets the foreground text colour.
:::
```

---

## Documentation

Full guide, syntax reference, i18n docs, and live examples at:  
**[https://matinfo.github.io/vitepress-plugin-quiz/](https://matinfo.github.io/vitepress-plugin-quiz/)**

---

## API

### `quizMarkdownPlugin(md)`

markdown-it plugin. Use in `.vitepress/config.ts` under `markdown.config`.

### `enhanceAppWithQuiz(app, lang?)`

Registers `<QuizQuestion>` and `<QuizPage>` on the Vue app, provides the locale, and auto-injects styles. `lang` defaults to `"en"`.

### `getLocale(lang?)` / `locales`

Access locale strings directly. `getLocale` falls back to English for unknown codes.

### Types

All TypeScript interfaces are re-exported from the main entry:

```ts
import type { QuizData, QuizAnswer, QuizLocale, QuizState } from "vitepress-plugin-quiz"
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[GPL-3.0](LICENSE)
