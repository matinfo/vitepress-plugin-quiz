# Quiz Syntax

Every quiz is written inside a `:::quiz` … `:::` fenced block. Place one block per question; they can appear anywhere on a page, including between regular Markdown content.

## Directives reference

| Directive | Required | Description |
|---|---|---|
| `question: <text>` | ✅ | The question text. Supports `**bold**`, `*italic*`, `` `code` `` inline formatting. |
| `answer: <text>` | Choice mode | A wrong answer option. |
| `answer-correct: <text>` | Choice mode | A correct answer option. Multiple lines = multiple correct answers (multi-select). |
| `answer-input: <text>` | Input mode | An accepted answer for fill-in-the-blank. Multiple lines = accepted variants (case-insensitive). |
| `explanation: <text>` | ❌ | Shown after validation. Supports the same rich text as `question:`. |
| `shuffle: true` | ❌ | Randomise answer order on every page load (choice mode only). |

::: tip Question types are auto-detected
If at least one `answer-input:` line is present, the question is treated as **fill-in-the-blank**. Otherwise it is **choice** (single or multiple depending on the number of `answer-correct:` lines).
:::

## Single-choice question

Exactly one `answer-correct:` line produces a radio-button-style question.

```md
:::quiz
question: Which language runs natively in a browser?
answer: Python
answer: Ruby
answer-correct: JavaScript
answer: PHP
explanation: JavaScript is the only language executed directly by browser engines.
shuffle: true
:::
```

## Multiple-choice question

Two or more `answer-correct:` lines produce a checkbox-style question. A hint *"Multiple answers possible"* is shown automatically.

```md
:::quiz
question: Which of the following are JavaScript frameworks?
answer-correct: Vue
answer-correct: React
answer: Django
answer-correct: Svelte
answer: Laravel
:::
```

## Fill-in-the-blank

Use `answer-input:` instead of `answer:`/`answer-correct:`. Add multiple lines to accept spelling variants.

```md
:::quiz
question: What CSS property controls the space **inside** an element's border?
answer-input: padding
answer-input: padding:
explanation: The `padding` property adds space between the content and the border.
:::
```

## Rich text

Question text, answer text, and explanations all support a subset of inline Markdown:

| Syntax | Result |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `` `code` `` | `code` |

```md
:::quiz
question: Which value makes a `<div>` a flex container?
answer: block
answer: inline
answer-correct: flex
answer: grid
explanation: Set `display: flex` to activate the **Flexbox** layout model.
:::
```

## Multiple questions per page

Place several `:::quiz` blocks on a single page. They are all wrapped in a shared `<QuizPage>` component that provides:

- A **sticky progress bar** showing answered / total
- A single **Validate** button (enabled when all questions are answered)
- A **score** display and **Reset** button after validation

```md
:::quiz
question: Q1 — What does DNS stand for?
answer: Dynamic Name System
answer-correct: Domain Name System
answer: Data Network Service
:::

Some regular content between questions is fine.

:::quiz
question: Q2 — Default HTTP port?
answer-input: 80
:::
```
