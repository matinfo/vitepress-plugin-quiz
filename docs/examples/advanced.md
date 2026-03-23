# Advanced Examples

These examples showcase richer usage: mixed question types, rich text, shuffling, edge cases, and multi-question page behaviour.

---

## Mixed question types on one page

A single page can combine single-choice, multiple-choice, and fill-in-the-blank questions. The progress bar and Validate button cover all of them together.

:::quiz
question: Which of the following are JavaScript array methods?
answer-correct: `map`
answer-correct: `filter`
answer-correct: `reduce`
answer: `grep`
answer: `collect`
explanation: JavaScript arrays have `map`, `filter`, and `reduce`. `grep` is a shell command; `collect` belongs to Laravel collections.
shuffle: true
:::

:::quiz
question: What does the `===` operator check in JavaScript?
answer: Value equality only
answer-correct: Value **and** type equality
answer: Reference equality
answer: Type equality only
explanation: The strict equality operator `===` checks both value **and** type — unlike `==` which coerces types.
:::

:::quiz
question: Which HTTP method is *idempotent* but **not** safe?
answer: GET
answer: POST
answer-correct: PUT
answer: PATCH
explanation: GET and HEAD are safe (no side effects) and idempotent. PUT is idempotent but not safe — it modifies a resource. POST is neither.
shuffle: true
:::

:::quiz
question: What keyword is used to pause execution inside an `async` function?
answer-input: await
explanation: The `await` keyword suspends the async function until the Promise resolves.
:::

---

## Rich text in questions and explanations

Questions, answer text, and explanations support `**bold**`, `*italic*`, and `` `code` `` formatting.

:::quiz
question: Which CSS `display` values create a **block formatting context**?
answer-correct: `flow-root`
answer-correct: `flex`
answer-correct: `grid`
answer: `inline`
answer: `contents`
explanation: `flow-root`, `flex`, and `grid` all establish a **block formatting context** (BFC), which contains floats and prevents margin collapsing.
shuffle: true
:::

:::quiz
question: In Vue 3, which function from `vue` wraps a *reactive* value in an object?
answer: `reactive`
answer-correct: `ref`
answer: `computed`
answer: `watch`
explanation: `ref()` wraps a value in a reactive object with a `.value` property. `reactive()` wraps plain objects, not primitives.
:::

---

## Shuffle stress test

All four answers are shuffled on every page load. Reload to verify.

:::quiz
question: What is the output of `typeof null` in JavaScript?
answer-correct: `"object"`
answer: `"null"`
answer: `"undefined"`
answer: `"symbol"`
explanation: `typeof null === "object"` is a well-known JavaScript quirk — a bug from the language's first version that was never fixed for backwards compatibility.
shuffle: true
:::

---

## Fill-in-the-blank — acronym with multiple spellings

:::quiz
question: What does the acronym **REST** stand for?
answer-input: Representational State Transfer
answer-input: representational state transfer
explanation: **REST** = Representational State Transfer — an architectural style for distributed hypermedia systems.
:::

:::quiz
question: In Git, which command creates a new branch *and* switches to it?
answer-input: git checkout -b
answer-input: git switch -c
explanation: Both `git checkout -b <branch>` and `git switch -c <branch>` create and switch to a new branch. Both are accepted here.
:::

---

## Edge case — single answer (fill-in)

Even with a single accepted answer, fill-in mode works correctly.

:::quiz
question: What is the default value of the CSS `position` property?
answer-input: static
explanation: Every HTML element has `position: static` by default, meaning it follows normal document flow.
:::
