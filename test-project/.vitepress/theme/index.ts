import DefaultTheme from "vitepress/theme"
import { enhanceAppWithQuiz } from "vitepress-plugin-quiz"
import type { Theme } from "vitepress"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithQuiz(app)
  },
} satisfies Theme
