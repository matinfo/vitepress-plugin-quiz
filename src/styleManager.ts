import quizCssInline from "./quiz.css?inline"

let stylesInjected = false

export function ensureStylesInjected(): void {
  if (typeof document === "undefined") return
  if (stylesInjected) return
  const styleId = "vitepress-plugin-quiz-styles"
  if (document.getElementById(styleId)) {
    stylesInjected = true
    return
  }
  const style = document.createElement("style")
  style.id = styleId
  style.textContent = quizCssInline
  document.head.appendChild(style)
  stylesInjected = true
}
