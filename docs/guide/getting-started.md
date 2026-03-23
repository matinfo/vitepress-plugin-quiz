# Getting Started

`vitepress-plugin-quiz` lets you embed interactive quizzes directly in your VitePress Markdown files using a simple `:::quiz` fenced block syntax. No Vue knowledge required.

## How it works

1. The **markdown-it plugin** (`quizMarkdownPlugin`) parses `:::quiz` blocks at build time and converts them into `<QuizQuestion>` component calls. All quiz data is encoded as a JSON attribute.
2. The **Vue components** (`QuizQuestion`, `QuizPage`) are registered globally via `enhanceAppWithQuiz` and handle the interactive behaviour client-side.
3. A sticky **progress bar** and **Validate** / **Reset** actions are managed by the wrapping `<QuizPage>` component, which is injected automatically around all questions on a page.

## Quick example

Add this to any `.md` file:

```md
:::quiz
question: What does CSS stand for?
answer: Computer Style Sheets
answer-correct: Cascading Style Sheets
answer: Creative Style Sheets
explanation: CSS = Cascading Style Sheets — the language that styles web pages.
shuffle: true
:::
```

This renders a fully interactive quiz with a Validate button, score, and explanation.

## Next steps

- [Installation](./installation) — install the package and wire it into your VitePress config
- [Quiz Syntax](./quiz-syntax) — full reference for all supported directives
- [Internationalisation](./i18n) — configure locale or add a custom one
- [Examples → Basic](../examples/basic) — try the live demo
