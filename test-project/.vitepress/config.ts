import { defineConfig } from "vitepress"
import { quizMarkdownPlugin } from "vitepress-plugin-quiz"

export default defineConfig({
  title: "Quiz Test Project",
  description: "Local test harness for vitepress-plugin-quiz",

  markdown: {
    config(md) {
      md.use(quizMarkdownPlugin)
    },
  },

  themeConfig: {
    nav: [
      { text: "Web Fundamentals Quiz", link: "/quiz-web-fundamentals" },
      { text: "Developer Tools Quiz", link: "/quiz-developer-tools" },
    ],
    sidebar: [
      { text: "Web Fundamentals", link: "/quiz-web-fundamentals" },
      { text: "Developer Tools", link: "/quiz-developer-tools" },
    ],
  },
})
