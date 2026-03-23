import type MarkdownIt from "markdown-it"
import type StateBlock from "markdown-it/lib/rules_block/state_block.mjs"
import type { QuizData, QuizAnswer } from "./types/quiz"

const QUIZ_RE = /^:::quiz\s*$/
const CLOSE_RE = /^:::\s*$/

/**
 * Register the quiz block rule on a markdown-it instance.
 * Use in VitePress config:
 *   markdown: { config(md) { md.use(quizMarkdownPlugin) } }
 */
export function quizMarkdownPlugin(md: MarkdownIt): void {
  const escapeHtml = md.utils.escapeHtml

  md.block.ruler.before(
    "fence",
    "quiz",
    (state, startLine, endLine, silent) =>
      quizBlockRule(state, startLine, endLine, silent, escapeHtml),
    { alt: ["paragraph", "reference", "blockquote", "list"] },
  )

  md.renderer.rules.quiz = (tokens, idx) => tokens[idx].content

  // Wrap entire token stream with <QuizPage>…</QuizPage> if quiz tokens exist
  md.core.ruler.push("quiz_page_wrap", (state) => {
    const hasQuiz = state.tokens.some((t) => t.type === "quiz")
    if (!hasQuiz) return

    const open = new state.Token("html_block", "", 0)
    open.content = "<QuizPage>\n"
    open.block = true

    const close = new state.Token("html_block", "", 0)
    close.content = "</QuizPage>\n"
    close.block = true

    state.tokens.unshift(open)
    state.tokens.push(close)
  })
}

/* ── block rule ──────────────────────────────────────────────────────── */

function quizBlockRule(
  state: StateBlock,
  startLine: number,
  endLine: number,
  silent: boolean,
  escapeHtml: (s: string) => string,
): boolean {
  const startPos = state.bMarks[startLine] + state.tShift[startLine]
  const startMax = state.eMarks[startLine]
  const lineText = state.src.slice(startPos, startMax)

  if (!QUIZ_RE.test(lineText)) return false
  if (silent) return true

  let nextLine = startLine + 1
  let found = false
  while (nextLine < endLine) {
    const pos = state.bMarks[nextLine] + state.tShift[nextLine]
    const max = state.eMarks[nextLine]
    const line = state.src.slice(pos, max)
    if (CLOSE_RE.test(line)) {
      found = true
      break
    }
    nextLine++
  }
  if (!found) return false

  const innerLines: string[] = []
  for (let i = startLine + 1; i < nextLine; i++) {
    const pos = state.bMarks[i] + state.tShift[i]
    const max = state.eMarks[i]
    innerLines.push(state.src.slice(pos, max))
  }

  const data = parseQuizBlock(innerLines)
  if (!data) return false

  const token = state.push("quiz", "", 0)
  token.content = renderQuizComponent(data, escapeHtml)
  token.map = [startLine, nextLine + 1]
  token.block = true

  state.line = nextLine + 1
  return true
}

/* ── parser ──────────────────────────────────────────────────────────── */

function parseQuizBlock(lines: string[]): QuizData | null {
  let question = ""
  const answers: QuizAnswer[] = []
  let explanation = ""
  const expected: string[] = []
  let shuffle = false

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    if (line.startsWith("question:")) {
      question = line.slice("question:".length).trim()
    } else if (line.startsWith("answer-correct:")) {
      answers.push({ text: line.slice("answer-correct:".length).trim(), correct: true })
    } else if (line.startsWith("answer-input:")) {
      expected.push(line.slice("answer-input:".length).trim())
    } else if (line.startsWith("answer:")) {
      answers.push({ text: line.slice("answer:".length).trim(), correct: false })
    } else if (line.startsWith("explanation:")) {
      explanation = line.slice("explanation:".length).trim()
    } else if (line.startsWith("explication:")) {
      // legacy French alias
      explanation = line.slice("explication:".length).trim()
    } else if (line.startsWith("shuffle:")) {
      shuffle = line.slice("shuffle:".length).trim().toLowerCase() === "true"
    }
  }

  if (!question) return null

  if (expected.length > 0) {
    return { question, type: "input", answers: [], expected, explanation, shuffle: false }
  }

  if (answers.length === 0) return null
  return { question, type: "choice", answers, expected: [], explanation, shuffle }
}

/* ── renderer ────────────────────────────────────────────────────────── */

function renderQuizComponent(data: QuizData, escapeHtml: (s: string) => string): string {
  const json = JSON.stringify(data)
  const escaped = escapeHtml(json)
  return `<QuizQuestion data-quiz="${escaped}" />\n`
}
