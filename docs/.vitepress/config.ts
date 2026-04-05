import { defineConfig } from "vitepress"
import { quizMarkdownPlugin } from "vitepress-plugin-quiz"

export default defineConfig({
  title: "vitepress-plugin-quiz",
  description: "Interactive quizzes in your VitePress docs — multiple-choice, fill-in-the-blank, i18n, sessionStorage persistence.",

  base: "/vitepress-plugin-quiz/",

  head: [
    ["link", { rel: "icon", href: "/vitepress-plugin-quiz/logo.svg" }],
    ["meta", { name: "theme-color", content: "#8835fc" }],
  ],

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "vitepress-plugin-quiz",

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Examples", link: "/examples/basic" },
      {
        text: "1.0.0",
        items: [
          {
            text: "Changelog",
            link: "https://github.com/matinfo/vitepress-plugin-quiz/blob/main/CHANGELOG.md",
          },
          {
            text: "Contributing",
            link: "https://github.com/matinfo/vitepress-plugin-quiz/blob/main/CONTRIBUTING.md",
          },
        ],
      },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Installation", link: "/guide/installation" },
          { text: "Quiz Syntax", link: "/guide/quiz-syntax" },
          { text: "Internationalisation", link: "/guide/i18n" },
          { text: "Troubleshooting", link: "/guide/troubleshooting" },
        ],
      },
      {
        text: "Examples",
        items: [
          { text: "World Capitals", link: "/examples/basic" },
          { text: "Markdown & VitePress", link: "/examples/advanced" },
          { text: "JavaScript Quirks", link: "/examples/developer-trivia" },
        ],
      },
    ],

    editLink: {
      pattern: "https://github.com/matinfo/vitepress-plugin-quiz/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/matinfo/vitepress-plugin-quiz" },
    ],

    footer: {
      message: "Released under the GPL-3.0 License.",
      copyright: "Copyright © 2026 matinfo",
    },

    search: { provider: "local" },
  },

  markdown: {
    config(md) {
      md.use(quizMarkdownPlugin)
    },
  },
})
