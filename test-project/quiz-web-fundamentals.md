# Web Fundamentals Quiz

Test your knowledge of core web technologies: HTML, CSS, and JavaScript.  
Answer **all** questions, then press **Validate** to see your score.

---

## HTML

:::quiz
question: What does the `<meta charset="UTF-8">` tag do?
answer: Sets the page language
answer-correct: Declares the character encoding of the document
answer: Defines the viewport width
answer: Links an external stylesheet
explanation: The `charset` meta tag tells the browser which character encoding to use when parsing the HTML. `UTF-8` covers virtually all characters across all writing systems.
shuffle: true
:::

:::quiz
question: Which HTML element is the correct container for navigation links?
answer: `<section>`
answer: `<aside>`
answer-correct: `<nav>`
answer: `<header>`
explanation: The `<nav>` element semantically represents a section of navigation links. It improves accessibility and SEO by marking primary navigation areas.
shuffle: true
:::

:::quiz
question: Which attributes are **required** on an `<img>` element for full accessibility?
answer-correct: `src`
answer-correct: `alt`
answer: `title`
answer: `width`
answer: `loading`
explanation: `src` provides the image URL; `alt` provides the text alternative for screen readers. The other attributes are useful but not required for accessibility.
shuffle: true
:::

---

## CSS

:::quiz
question: In the CSS box model, which property adds space *between* the content and the border?
answer-input: padding
explanation: `padding` sits between the content area and the border. `margin` sits outside the border.
:::

:::quiz
question: Which CSS value for `position` removes an element from the normal document flow but keeps it relative to its nearest positioned ancestor?
answer: `static`
answer: `relative`
answer-correct: `absolute`
answer: `fixed`
explanation: `absolute` takes the element out of flow and positions it relative to the nearest ancestor with `position` other than `static`. `relative` keeps the element in flow.
shuffle: true
:::

:::quiz
question: Which CSS properties can be used to horizontally centre a flex item inside its container?
answer-correct: `justify-content: center`
answer-correct: `margin: 0 auto`
answer: `align-items: center`
answer: `text-align: center`
explanation: On a flex container, `justify-content: center` centres children along the main axis. On the item itself, `margin: 0 auto` also works. `align-items: center` centres on the *cross* axis.
shuffle: true
:::

---

## JavaScript

:::quiz
question: What does `typeof null` return in JavaScript?
answer: `"null"`
answer-correct: `"object"`
answer: `"undefined"`
answer: `"symbol"`
explanation: `typeof null === "object"` is a famous JavaScript quirk — it stems from the original implementation and was never corrected to avoid breaking existing code.
shuffle: true
:::

:::quiz
question: Which of the following are **falsy** values in JavaScript?
answer-correct: `0`
answer-correct: `""`
answer-correct: `null`
answer-correct: `undefined`
answer: `"false"`
answer: `[]`
explanation: Falsy values: `false`, `0`, `""`, `null`, `undefined`, `NaN`, `0n`. Note that `"false"` (a non-empty string) and `[]` (an array) are **truthy**.
shuffle: true
:::

:::quiz
question: What ES2015+ syntax lets you extract values from an object into variables?
answer-input: destructuring
answer-input: object destructuring
explanation: **Destructuring** assignment syntax: `const { a, b } = obj`. It was introduced in ES2015 (ES6).
:::

:::quiz
question: Which array method returns a **new** array with each element transformed by a callback?
answer: `forEach`
answer-correct: `map`
answer: `filter`
answer: `reduce`
explanation: `Array.prototype.map()` returns a new array where each element is the result of calling the callback. `forEach` returns `undefined`.
shuffle: true
:::
