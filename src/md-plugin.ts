import type MarkdownIt from "markdown-it"
import type StateBlock from "markdown-it/lib/rules_block/state_block.mjs"
import type { QuizData, QuizAnswer } from "./types/quiz"

const QUIZ_RE = /^:::quiz\s*$/
const CLOSE_RE = /^:::\s*$/
const KEY_RE = /^([A-Za-z-]+):(.*)$/
const KNOWN_KEYS = new Set([
  "question",
  "answer",
  "answer-correct",
  "answer-input",
  "explanation",
  "explication",
  "shuffle",
])

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
  // 4+ spaces of indentation is an indented code block, not a quiz
  if (state.sCount[startLine] - state.blkIndent >= 4) return false

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
  if (data?.type === "choice" && !data.answers.some((a) => a.correct)) {
    console.warn(
      `[vitepress-plugin-quiz] :quiz block at line ${startLine + 1} has no 'answer-correct:'; ` +
        "it can never be answered correctly.",
    )
  }
  if (!data) {
    console.warn(
      `[vitepress-plugin-quiz] Ignored invalid :::quiz block at line ${startLine + 1}: ` +
        "needs a 'question:' and at least one 'answer:'/'answer-correct:' or 'answer-input:'.",
    )
    return false
  }

  const token = state.push("quiz", "", 0)
  token.content = renderQuizComponent(data, escapeHtml)
  token.map = [startLine, nextLine + 1]
  token.block = true

  state.line = nextLine + 1
  return true
}

/* ── parser ──────────────────────────────────────────────────────────── */

export function parseQuizBlock(lines: string[]): QuizData | null {
  let question = ""
  const answers: QuizAnswer[] = []
  let explanation = ""
  const expected: string[] = []
  let shuffle = false

  // Lines that are not a known `key:` continue the previous field (multi-line values).
  let append: ((extra: string) => void) | null = null

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    const m = KEY_RE.exec(line)
    const key = m?.[1].toLowerCase()
    if (!m || !key || !KNOWN_KEYS.has(key)) {
      append?.(line)
      continue
    }
    const value = m[2].trim()
    const join = (cur: string, extra: string) => (cur ? `${cur} ${extra}` : extra)

    switch (key) {
      case "question":
        question = value
        append = (x) => (question = join(question, x))
        break
      case "answer-correct":
      case "answer": {
        const entry: QuizAnswer = { text: value, correct: key === "answer-correct" }
        answers.push(entry)
        append = (x) => (entry.text = join(entry.text, x))
        break
      }
      case "answer-input":
        if (value) expected.push(value)
        append = null
        break
      case "explanation":
      case "explication": // legacy French alias
        explanation = value
        append = (x) => (explanation = join(explanation, x))
        break
      case "shuffle":
        shuffle = value.toLowerCase() === "true"
        append = null
        break
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
