import DefaultTheme from "vitepress/theme"
import { enhanceAppWithQuiz } from "vitepress-plugin-quiz"
import type { Theme } from "vitepress"
import "./custom.css"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithQuiz(app) // uses English locale by default
  },
} satisfies Theme
