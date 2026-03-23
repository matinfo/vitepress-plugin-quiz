import { describe, it, expect, beforeEach } from "vitest"
import MarkdownIt from "markdown-it"
import { parseQuizBlock, quizMarkdownPlugin } from "../md-plugin"

/* ── parseQuizBlock unit tests ─────────────────────────────────────── */

describe("parseQuizBlock", () => {
  it("returns null for empty lines", () => {
    expect(parseQuizBlock([])).toBeNull()
  })

  it("returns null when question is missing", () => {
    expect(parseQuizBlock(["answer: Paris", "answer-correct: Berlin"])).toBeNull()
  })

  it("returns null when no answers and no expected (choice quiz with no options)", () => {
    expect(parseQuizBlock(["question: What is 2+2?"])).toBeNull()
  })

  it("parses a single-choice quiz", () => {
    const data = parseQuizBlock([
      "question: Capital of France?",
      "answer: Madrid",
      "answer-correct: Paris",
      "answer: Berlin",
    ])
    expect(data).not.toBeNull()
    expect(data!.type).toBe("choice")
    expect(data!.question).toBe("Capital of France?")
    expect(data!.answers).toHaveLength(3)
    expect(data!.answers.filter((a) => a.correct)).toHaveLength(1)
    expect(data!.answers.find((a) => a.correct)?.text).toBe("Paris")
  })

  it("parses a multi-choice quiz", () => {
    const data = parseQuizBlock([
      "question: Which are JS frameworks?",
      "answer-correct: Vue",
      "answer-correct: React",
      "answer: Django",
    ])
    expect(data!.type).toBe("choice")
    expect(data!.answers.filter((a) => a.correct)).toHaveLength(2)
  })

  it("parses a fill-in-the-blank quiz", () => {
    const data = parseQuizBlock([
      "question: Command to initialise a git repo?",
      "answer-input: git init",
    ])
    expect(data).not.toBeNull()
    expect(data!.type).toBe("input")
    expect(data!.expected).toEqual(["git init"])
    expect(data!.answers).toHaveLength(0)
  })

  it("captures explanation", () => {
    const data = parseQuizBlock([
      "question: Q?",
      "answer-correct: A",
      "explanation: Because reasons",
    ])
    expect(data!.explanation).toBe("Because reasons")
  })

  it("handles explication (legacy French alias)", () => {
    const data = parseQuizBlock([
      "question: Q?",
      "answer-correct: A",
      "explication: Parce que",
    ])
    expect(data!.explanation).toBe("Parce que")
  })

  it("parses shuffle flag", () => {
    const data = parseQuizBlock([
      "question: Q?",
      "answer-correct: A",
      "answer: B",
      "shuffle: true",
    ])
    expect(data!.shuffle).toBe(true)
  })

  it("shuffle is false by default", () => {
    const data = parseQuizBlock(["question: Q?", "answer-correct: A", "answer: B"])
    expect(data!.shuffle).toBe(false)
  })

  it("ignores blank lines in input", () => {
    const data = parseQuizBlock(["", "question: Q?", "", "answer-correct: A", ""])
    expect(data).not.toBeNull()
    expect(data!.question).toBe("Q?")
  })
})

/* ── quizMarkdownPlugin end-to-end ───────────────────────────────── */

describe("quizMarkdownPlugin (end-to-end via markdown-it)", () => {
  let md: MarkdownIt

  beforeEach(() => {
    md = new MarkdownIt()
    quizMarkdownPlugin(md)
  })

  it("renders a choice quiz block into a QuizQuestion component tag", () => {
    const src = [
      ":::quiz",
      "question: Capital of France?",
      "answer-correct: Paris",
      "answer: Madrid",
      ":::",
    ].join("\n")
    const html = md.render(src)
    expect(html).toContain("<QuizQuestion")
    expect(html).toContain("data-quiz=")
  })

  it("embeds escaped quiz JSON in data-quiz attribute", () => {
    const src = [
      ":::quiz",
      "question: What is Vue?",
      "answer-correct: A JS framework",
      "answer: A database",
      ":::",
    ].join("\n")
    const html = md.render(src)
    expect(html).toContain("What is Vue?")
  })

  it("leaves normal markdown paragraphs untouched", () => {
    const html = md.render("Hello **world**")
    expect(html).toContain("<strong>world</strong>")
    expect(html).not.toContain("QuizQuestion")
  })

  it("renders an input quiz block", () => {
    const src = [
      ":::quiz",
      "question: Command to init a git repo?",
      "answer-input: git init",
      ":::",
    ].join("\n")
    const html = md.render(src)
    expect(html).toContain("<QuizQuestion")
  })
})
