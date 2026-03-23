# Installation

## 1. Install the package

::: code-group

```sh [bun]
bun add vitepress-plugin-quiz
```

```sh [npm]
npm install vitepress-plugin-quiz
```

```sh [yarn]
yarn add vitepress-plugin-quiz
```

```sh [pnpm]
pnpm add vitepress-plugin-quiz
```

:::

## 2. Register the markdown plugin

In your `.vitepress/config.ts`, enable the `:::quiz` block parser:

```ts
// .vitepress/config.ts
import { defineConfig } from "vitepress"
import { quizMarkdownPlugin } from "vitepress-plugin-quiz"

export default defineConfig({
  // ...
  markdown: {
    config(md) {
      md.use(quizMarkdownPlugin)
    },
  },
})
```

## 3. Register the Vue components

In your custom theme entry point, call `enhanceAppWithQuiz`:

```ts
// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme"
import { enhanceAppWithQuiz } from "vitepress-plugin-quiz"
import type { Theme } from "vitepress"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithQuiz(app) // English locale by default
  },
} satisfies Theme
```

> **Styles are injected automatically.** You do not need to import any CSS file manually.

## 4. Write your first quiz

Create or edit any `.md` page and add a `:::quiz` block:

```md
:::quiz
question: What does HTML stand for?
answer: Home Tool Markup Language
answer-correct: HyperText Markup Language
answer: Hyperlinks and Text Markup Language
explanation: HTML = HyperText Markup Language, the standard markup language for web pages.
:::
```

Run `vitepress dev` and visit the page — your quiz is live!
