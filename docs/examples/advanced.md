# Markdown & VitePress Quiz

For the audience most likely to use this plugin — people who write docs in VitePress. Shows rich-text formatting in answers and explanations.

---

## Mixed question types

All three question types on one page. The progress bar covers them together.

:::quiz
question: Which Markdown syntax creates a **level-2 heading**?
answer: `# Heading`
answer-correct: `## Heading`
answer: `### Heading`
answer: `---- Heading`
explanation: A single `#` creates an H1, `##` creates an H2, and so on up to `######` for H6.
shuffle: true
:::

:::quiz
question: Which characters produce a horizontal rule in Markdown?
answer-correct: `---`
answer-correct: `***`
answer-correct: `___`
answer: `===`
answer: `...`
explanation: Three or more hyphens `---`, asterisks `***`, or underscores `___` all render as a `<hr>` horizontal rule.
shuffle: true
:::

:::quiz
question: In VitePress frontmatter, which key sets the page title shown in the browser tab?
answer: `description`
answer: `layout`
answer-correct: `title`
answer: `head`
explanation: The `title` frontmatter key overrides the page title used in the `<title>` tag. `head` lets you inject arbitrary `<head>` elements.
shuffle: true
:::

:::quiz
question: What VitePress container type is used for a tip callout?
answer-input: tip
explanation: Write `:::tip` … `:::` to render a tip callout box. Other built-in types are `info`, `warning`, `danger`, and `details`.
:::

---

## Rich text in questions and explanations

Questions, answers, and explanations support `**bold**`, `*italic*`, and `` `code` `` formatting.

:::quiz
question: Which syntax makes text **bold** in Markdown?
answer: `*text*`
answer-correct: `**text**`
answer: `__text_` 
answer: `~~text~~`
explanation: Wrap text in `**double asterisks**` or `__double underscores__` for **bold**. Single asterisks or underscores produce *italic*.
shuffle: true
:::

:::quiz
question: In VitePress, which `vue` composable gives you the current page's *frontmatter* data?
answer: `useData().page`
answer-correct: `useData().frontmatter`
answer: `useRoute().meta`
answer: `useFrontmatter()`
explanation: `useData()` returns `{ site, page, theme, frontmatter, lang, … }`. Access `useData().frontmatter` to read the current page's YAML frontmatter.
shuffle: true
:::

---

## Shuffle stress test

All four answers are shuffled on every page load. Reload to verify.

:::quiz
question: What syntax creates a *fenced code block* with syntax highlighting in Markdown?
answer-correct: Triple backticks followed by a language name
answer: Four spaces of indentation
answer: Triple tildes only (no language tag needed)
answer: A `<code>` HTML tag
explanation: Surround code with ` ``` ` and add the language identifier (e.g. ` ```js `) to get syntax highlighting. Indentation-based code blocks do not support language tagging.
shuffle: true
:::

---

## Fill-in-the-blank — syntax with multiple accepted variants

:::quiz
question: What is the Markdown syntax to create an *italicised* word?
answer-input: *word*
answer-input: _word_
explanation: Both `*single asterisks*` and `_single underscores_` produce *italic* text. Both variants are accepted here.
:::

:::quiz
question: In a VitePress `config.ts`, which key inside `themeConfig` defines the top navigation bar links?
answer-input: nav
explanation: The `nav` array inside `themeConfig` defines the items shown in the top navigation bar.
:::

---

## Edge case — single fill-in answer

Even with a single accepted answer, fill-in mode works correctly.

:::quiz
question: What file extension does a standard VitePress configuration file use?
answer-input: .ts
answer-input: ts
explanation: The VitePress config is conventionally named `config.ts` (TypeScript). A plain JS variant `config.js` is also supported, but `.ts` is the default.
:::
