import { h, defineComponent } from "vue"
import { mount } from "@vue/test-utils"
import QuizPage from "../QuizPage.vue"
import QuizQuestion from "../QuizQuestion.vue"
import { getLocale } from "../locales"
import { parseQuizBlock } from "../md-plugin"

/** Build the JSON string a rendered `<QuizQuestion data-quiz>` receives. */
export function quizJson(lines: string[]): string {
  const data = parseQuizBlock(lines)
  if (!data) throw new Error("invalid quiz fixture")
  return JSON.stringify(data)
}

/** Mount a QuizPage holding one QuizQuestion per fixture (same tree the md plugin emits). */
export function mountPage(fixtures: string[][], lang = "en") {
  const Wrapper = defineComponent({
    render: () =>
      h(QuizPage, null, {
        default: () => fixtures.map((f) => h(QuizQuestion, { dataQuiz: quizJson(f) })),
      }),
  })
  return mount(Wrapper, {
    attachTo: document.body,
    global: { provide: { "quiz-locale": getLocale(lang) } },
  })
}

export const answerTexts = (w: ReturnType<typeof mountPage>, q = 0) =>
  w
    .findAll(".quiz-question")
    [q].findAll(".quiz-answer-text")
    .map((n) => n.text())
