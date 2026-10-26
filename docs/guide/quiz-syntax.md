# Quiz Syntax

Every quiz is written inside a `:::quiz` … `:::` fenced block. Place one block per question; they can appear anywhere on a page, including between regular Markdown content.

## Directives reference

| Directive | Required | Description |
|---|---|---|
| `question: <text>` | ✅ | The question text. Supports `**bold**`, `*italic*`, `` `code` `` inline formatting. |
| `answer: <text>` | Choice mode | A wrong answer option. |
| `answer-correct: <text>` | Choice mode | A correct answer option. Multiple lines = multiple correct answers (multi-select). |
| `answer-input: <text>` | Input mode | An accepted answer for fill-in-the-blank. Multiple lines = accepted variants (ignores case, accents and extra spaces). |
| `pair: <left> => <right>` | Association mode | One item and its correct match. Two or more lines = association question. |
| `distractor: <text>` | ❌ | Extra wrong option added to the association drop-downs. |
| `explanation: <text>` | ❌ | Shown after validation. Supports the same rich text as `question:`. |
| `shuffle: true` | ❌ | Randomise answer order (choice) or drop-down option order (association) on every page load and reset. Ignored in input mode. |

## Supported question types

| Type | Keys | Correct when | Shuffle |
|---|---|---|---|
| Single choice | `answer:` + one `answer-correct:` | the correct answer is selected | ✅ |
| Multiple choice | `answer:` + two or more `answer-correct:` | exactly the correct set is selected | ✅ |
| Fill-in-the-blank | one or more `answer-input:` | the text matches any variant | ❌ |
| Association | two or more `pair:` (+ optional `distractor:`) | every item has its matching option | ✅ (options) |

::: tip Question types are auto-detected
If at least one `answer-input:` line is present, the question is treated as **fill-in-the-blank**. Otherwise, if two or more `pair:` lines are present, it is an **association**. Otherwise it is **choice** (single or multiple depending on the number of `answer-correct:` lines).
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

## Association

Each `pair:` line is `item => correct match`. The arrow `-->` also works (`item --> correct match`); `=>` takes priority when both appear. Every item gets a drop-down; the options are built automatically from all the right-hand values (duplicates merged, so several items may share one answer). Add `distractor:` lines for extra wrong options. All items must be matched correctly for the question to count as correct.

Requirements and behaviour:

- At least **two** valid `pair:` lines are needed; with fewer, the block is treated as a choice question (and ignored if it has no `answer:` lines).
- A `pair:` line without `=>` or `-->`, or with an empty side, is skipped (a build-time warning is logged for a missing arrow).
- The validate button stays disabled until every row has a selection.
- After validation, wrong rows are marked and show the expected value.
- `shuffle: true` reorders the drop-down options only; the rows keep their source order.
- Selections are persisted for the session like other question types.

```md
:::quiz
question: Match each language to its category
pair: TypeScript => Compiled
pair: Python => Interpreted
pair: HTML => Markup
pair: SQL => Query language
distractor: Assembly
explanation: HTML is a markup language, not a programming language.
shuffle: true
:::
```

Left-hand items support `**bold**`, `*italic*` and `` `code` ``; drop-down options are plain text, so formatting characters there appear literally.

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
