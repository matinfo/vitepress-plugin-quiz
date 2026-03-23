# JavaScript Quirks Quiz

Fun facts and surprising corners of JavaScript — every developer has encountered these.

---

:::quiz
question: What does `typeof null` return in JavaScript?
answer: `"null"`
answer-correct: `"object"`
answer: `"undefined"`
answer: `"symbol"`
explanation: `typeof null === "object"` is a historic bug from JavaScript's first days. The spec acknowledges it, but it was never fixed to avoid breaking the web.
shuffle: true
:::

:::quiz
question: What is the result of `0.1 + 0.2 === 0.3` in JavaScript?
answer-correct: `false`
answer: `true`
explanation: Floating-point arithmetic (IEEE 754) means `0.1 + 0.2` evaluates to `0.30000000000000004`, not `0.3`. Always compare floats with a tolerance, e.g. `Math.abs(a - b) < Number.EPSILON`.
:::

:::quiz
question: Which of these values are *falsy* in JavaScript?
answer-correct: `0`
answer-correct: `""`
answer-correct: `null`
answer-correct: `NaN`
answer: `"0"`
answer: `[]`
explanation: `0`, `""`, `null`, `undefined`, `NaN`, and `false` are all falsy. Notably, `"0"` and `[]` are **truthy** — the string `"0"` is non-empty, and all objects (including empty arrays) are truthy.
shuffle: true
:::

:::quiz
question: What does `[] + []` evaluate to?
answer: `[]`
answer-correct: `""`
answer: `0`
answer: `"[][]"`
explanation: Both arrays are coerced to strings (empty string `""`), so the result is `"" + "" = ""`. JavaScript's `+` operator with non-Number operands triggers type coercion.
shuffle: true
:::

:::quiz
question: What is `NaN === NaN` in JavaScript?
answer-correct: `false`
answer: `true`
explanation: `NaN` is the **only** value in JavaScript that is not equal to itself. Use `Number.isNaN(value)` to check for it reliably.
:::

:::quiz
question: Which `Array` method returns a **new** array without modifying the original?
answer-correct: `map`
answer-correct: `filter`
answer-correct: `slice`
answer: `push`
answer: `sort`
explanation: `map`, `filter`, and `slice` return new arrays. `push` mutates the array in place. `sort` also mutates — a common trap! Use `.toSorted()` (ES2023) for an immutable sort.
shuffle: true
:::

:::quiz
question: What keyword would you type to access the value of an awaited Promise inside an `async` function?
answer-input: await
explanation: `await` pauses the `async` function until the Promise resolves and unwraps its value. Without it, you get the Promise object itself.
:::

:::quiz
question: What is the output of `typeof undefined`?
answer-input: undefined
explanation: `typeof undefined === "undefined"`. Unlike `typeof null`, this one makes sense — and `typeof` never throws even for undeclared variables.
:::
