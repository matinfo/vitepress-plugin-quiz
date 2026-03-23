# Basic Examples

A tour of the three question types available in `vitepress-plugin-quiz`.

---

## Single-choice

One correct answer — displays radio-button style indicators.

:::quiz
question: What does HTML stand for?
answer: Home Tool Markup Language
answer-correct: HyperText Markup Language
answer: Hyperlinks and Text Markup Language
answer: High-level Text Markup Language
explanation: HTML = **HyperText Markup Language** — the standard language for creating web pages.
shuffle: true
:::

---

## Multiple-choice

Two or more correct answers — displays checkbox style. A *"Multiple answers possible"* hint is shown automatically.

:::quiz
question: Which of the following are valid CSS box-model properties?
answer-correct: margin
answer-correct: padding
answer-correct: border
answer: float
answer: position
explanation: The CSS box model consists of **content**, `padding`, `border`, and `margin`.
shuffle: true
:::

---

## Single-choice with `code` in answers

Answer text supports inline `` `code` `` formatting.

:::quiz
question: Which CSS declaration centres a block element horizontally?
answer: `display: center`
answer-correct: `margin: 0 auto`
answer: `align: center`
answer: `position: center`
explanation: Use `margin: 0 auto` on a block element with an explicit width to centre it.
:::

---

## Fill-in-the-blank (single accepted answer)

The player types a free-text answer. Comparison is case-insensitive.

:::quiz
question: What CSS property changes the text colour of an element?
answer-input: color
explanation: The `color` property sets the foreground text colour in CSS.
:::

---

## Fill-in-the-blank (multiple accepted variants)

Provide several `answer-input:` lines to accept different spellings or formats.

:::quiz
question: What HTTP status code means "Not Found"?
answer-input: 404
answer-input: 404 Not Found
explanation: HTTP **404** is returned when the server cannot find the requested resource.
:::

---

## With explanation only (no shuffle)

Answers are shown in the order they were written.

:::quiz
question: In JavaScript, which keyword declares a block-scoped variable?
answer: var
answer: function
answer-correct: let
answer-correct: const
explanation: Both `let` and `const` are block-scoped. `var` is function-scoped and hoisted.
:::
