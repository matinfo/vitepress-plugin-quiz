import type { App } from "vue"
import { ensureStylesInjected } from "./styleManager"

export { quizMarkdownPlugin } from "./md-plugin"
export { getLocale, locales } from "./locales"
export type { QuizData, QuizAnswer, QuizLocale, QuizState, SavedAnswer } from "./types/quiz"

import QuizQuestion from "./QuizQuestion.vue"
import QuizPage from "./QuizPage.vue"
import { getLocale as _getLocale } from "./locales"

export { QuizQuestion, QuizPage }

/**
 * Register quiz components and locale in a VitePress `enhanceApp` hook.
 *
 * @example
 * // .vitepress/theme/index.ts
 * import { enhanceAppWithQuiz } from 'vitepress-plugin-quiz'
 * export default {
 *   enhanceApp({ app }) {
 *     enhanceAppWithQuiz(app)        // English (default)
 *     enhanceAppWithQuiz(app, 'fr')  // French
 *   }
 * }
 */
export function enhanceAppWithQuiz(app: App, lang = "en"): void {
  ensureStylesInjected()
  app.provide("quiz-locale", _getLocale(lang))
  app.component("QuizQuestion", QuizQuestion)
  app.component("QuizPage", QuizPage)
}
