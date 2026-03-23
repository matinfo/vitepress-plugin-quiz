# Troubleshooting

## Quiz blocks are rendered as plain text

**Cause:** The markdown-it plugin was not registered.

**Fix:** Make sure `quizMarkdownPlugin` is added in your `.vitepress/config.ts`:

```ts
import { quizMarkdownPlugin } from "vitepress-plugin-quiz"

export default defineConfig({
  markdown: {
    config(md) {
      md.use(quizMarkdownPlugin) // ← required
    },
  },
})
```

---

## Components are not interactive / show as raw HTML

**Cause:** `enhanceAppWithQuiz` was not called, so `QuizQuestion` and `QuizPage` are not registered.

**Fix:** Add the call in your theme entry point:

```ts
// .vitepress/theme/index.ts
import { enhanceAppWithQuiz } from "vitepress-plugin-quiz"
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithQuiz(app)
  },
}
```

---

## Styles are missing

The plugin injects styles automatically at runtime via `enhanceAppWithQuiz`. If styles are absent:

1. Confirm `enhanceAppWithQuiz` is being called (see above).
2. Make sure you are **not** running an SSR/prerender path that skips `enhanceApp`. The style injection is SSR-safe and no-ops on the server.

---

## Answers reset on every navigation

**Expected behaviour:** answers are persisted via `sessionStorage` keyed to the page URL. If you are using a client-side router and the URL does not change (e.g. hash-only navigation), the state key remains the same and answers are preserved.

If answers do reset unexpectedly, check that:
- `sessionStorage` is not blocked by browser settings or extensions.
- The page URL is stable (not randomly suffixed).

---

## Validate button stays disabled

The Validate button is enabled only when **every** question on the page has been answered. Check:
- All `:::quiz` blocks have at least one answer selected or input filled.
- You have not accidentally placed questions in different layout slots that would split them into separate `<QuizPage>` instances.

---

## TypeScript error: cannot find module `vitepress-plugin-quiz`

Ensure the package is installed and your `tsconfig.json` resolves modules correctly:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

---

## Build errors with `markdown-it` types

Add `@types/markdown-it` as a dev dependency:

```sh
bun add -d @types/markdown-it
```
