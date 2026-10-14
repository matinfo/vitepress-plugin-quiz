import { describe, it, expect, beforeEach, vi } from "vitest"
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

/* ── parser edge cases ───────────────────────────────────────────────── */

describe("parseQuizBlock — edge cases", () => {
  it("keeps colons inside values", () => {
    const d = parseQuizBlock(["question: Ratio 1:2?", "answer-correct: http://x.y:80"])
    expect(d!.question).toBe("Ratio 1:2?")
    expect(d!.answers[0].text).toBe("http://x.y:80")
  })

  it("keys are case-insensitive", () => {
    const d = parseQuizBlock(["Question: Q?", "Answer-Correct: A", "ANSWER: B", "Shuffle: TRUE"])
    expect(d!.answers.map((a) => a.correct)).toEqual([true, false])
    expect(d!.shuffle).toBe(true)
  })

  it("answer-correct is not mistaken for answer", () => {
    const d = parseQuizBlock(["question: Q?", "answer-correct: A"])
    expect(d!.answers).toEqual([{ text: "A", correct: true }])
  })

  it("answer-input wins over choice answers; shuffle forced off", () => {
    const d = parseQuizBlock(["question: Q?", "answer: x", "answer-input: y", "shuffle: true"])
    expect(d!.type).toBe("input")
    expect(d!.answers).toEqual([])
    expect(d!.shuffle).toBe(false)
  })

  it("supports several accepted input variants", () => {
    const d = parseQuizBlock(["question: Q?", "answer-input: a", "answer-input: b"])
    expect(d!.expected).toEqual(["a", "b"])
  })

  it("ignores empty answer-input values", () => {
    expect(parseQuizBlock(["question: Q?", "answer-input:"])).toBeNull()
  })

  it("ignores free text before any field", () => {
    const d = parseQuizBlock(["stray line", "question: Q?", "answer-correct: A"])
    expect(d!.question).toBe("Q?")
  })

  it("continuation lines extend the previous field", () => {
    const d = parseQuizBlock([
      "question: A long",
      "  question on two lines?",
      "answer-correct: First",
      "  part",
      "answer: B",
      "explanation: Line one",
      "line two",
    ])
    expect(d!.question).toBe("A long question on two lines?")
    expect(d!.answers.map((a) => a.text)).toEqual(["First part", "B"])
    expect(d!.explanation).toBe("Line one line two")
  })

  it("continuation does not leak into answer-input or shuffle", () => {
    const d = parseQuizBlock(["question: Q?", "answer-input: a", "stray"])
    expect(d!.expected).toEqual(["a"])
  })

  it("last explanation wins, preserves inline markdown", () => {
    const d = parseQuizBlock(["question: Q?", "answer-correct: A", "explanation: one", "explication: **two**"])
    expect(d!.explanation).toBe("**two**")
  })

  it("shuffle only true for literal 'true'", () => {
    expect(parseQuizBlock(["question: Q?", "answer: A", "shuffle: yes"])!.shuffle).toBe(false)
  })

  it("a quiz with only wrong answers still parses (no correct answer)", () => {
    const d = parseQuizBlock(["question: Q?", "answer: A", "answer: B"])
    expect(d!.answers.some((a) => a.correct)).toBe(false)
  })
})

describe("quizMarkdownPlugin — document level", () => {
  const block = (...l: string[]) => [":::quiz", ...l, ":::"].join("\n")
  const make = () => {
    const md = new MarkdownIt()
    quizMarkdownPlugin(md)
    return md
  }
  const payload = (html: string) => {
    const m = /data-quiz="([^"]*)"/.exec(html)!
    const json = m[1].replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    return JSON.parse(json)
  }

  it("wraps the page in <QuizPage> exactly once, even with several quizzes", () => {
    const html = make().render(
      [block("question: A?", "answer-correct: x"), "text", block("question: B?", "answer-correct: y")].join("\n\n"),
    )
    expect(html.startsWith("<QuizPage>")).toBe(true)
    expect(html.trimEnd().endsWith("</QuizPage>")).toBe(true)
    expect(html.match(/<QuizPage>/g)).toHaveLength(1)
    expect(html.match(/<QuizQuestion/g)).toHaveLength(2)
  })

  it("does not wrap pages without a quiz", () => {
    expect(make().render("# Title\n\ntext")).not.toContain("QuizPage")
  })

  it("keeps surrounding markdown intact and in order", () => {
    const html = make().render(["# Intro", block("question: Q?", "answer-correct: A"), "After"].join("\n\n"))
    expect(html.indexOf("<h1")).toBeLessThan(html.indexOf("<QuizQuestion"))
    expect(html.indexOf("<QuizQuestion")).toBeLessThan(html.indexOf("After"))
  })

  it("round-trips hostile text through the attribute without breaking out", () => {
    const evil = `"><script>alert(1)</script> & 'x' {{ 1+1 }}`
    const html = make().render(block(`question: ${evil}`, `answer-correct: ${evil}`))
    expect(html).not.toContain("<script>")
    expect(payload(html).question).toBe(evil)
    expect(payload(html).answers[0].text).toBe(evil)
  })

  it("preserves unicode and accents", () => {
    const html = make().render(block("question: Quelle est la capitale de la Suisse ?", "answer-correct: Berne – « fédérale »"))
    expect(payload(html).answers[0].text).toBe("Berne – « fédérale »")
  })

  it("handles CRLF line endings", () => {
    const html = make().render(block("question: Q?", "answer-correct: A", "answer: B").replace(/\n/g, "\r\n"))
    expect(payload(html).answers).toHaveLength(2)
  })

  it("an unclosed block is left as plain text, not swallowed", () => {
    const html = make().render(":::quiz\nquestion: Q?\nanswer-correct: A")
    expect(html).not.toContain("QuizQuestion")
    expect(html).toContain("question: Q?")
  })

  it("an invalid block (no answers) falls through and warns with line number", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const html = make().render("intro\n\n" + block("question: Q?"))
    expect(html).not.toContain("QuizQuestion")
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("line 3"))
    warn.mockRestore()
  })

  it("indented 4+ spaces is a code block, not a quiz", () => {
    const html = make().render("    :::quiz\n    question: Q?\n    answer-correct: A\n    :::")
    expect(html).toContain("<pre>")
    expect(html).not.toContain("QuizQuestion")
  })

  it("warns when a choice quiz has no correct answer", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    make().render(block("question: Q?", "answer: A"))
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("no 'answer-correct:'"))
    warn.mockRestore()
  })

  it("works inside a list item", () => {
    const html = make().render("- item\n\n  " + block("question: Q?", "answer-correct: A").split("\n").join("\n  "))
    expect(html).toContain("<QuizQuestion")
  })

  it("does not trigger on ':::quiz extra' or other containers", () => {
    const html = make().render(":::quizz\nquestion: Q?\nanswer-correct: A\n:::")
    expect(html).not.toContain("QuizQuestion")
  })

  it("two consecutive blocks without blank line both render", () => {
    const html = make().render(
      [block("question: A?", "answer-correct: x"), block("question: B?", "answer-correct: y")].join("\n"),
    )
    expect(html.match(/<QuizQuestion/g)).toHaveLength(2)
  })
})
