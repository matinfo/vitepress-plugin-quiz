import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { nextTick } from "vue"
import { mountPage, answerTexts } from "./helpers"

const SINGLE = ["question: Capital of France?", "answer: Madrid", "answer-correct: Paris", "answer: Berlin"]
const MULTI = ["question: JS frameworks?", "answer-correct: Vue", "answer-correct: React", "answer: Django"]
const INPUT = ["question: Init a repo?", "answer-input: git init", "answer-input: git  init -b main"]
const SHUFFLED = [
  "question: Pick B",
  "answer: A",
  "answer-correct: B",
  "answer: C",
  "answer: D",
  "answer: E",
  "answer: F",
  "shuffle: true",
]

const pick = async (w: ReturnType<typeof mountPage>, q: number, text: string) => {
  const li = w
    .findAll(".quiz-question")
    [q].findAll(".quiz-answer")
    .find((n) => n.text().includes(text))!
  await li.trigger("click")
}
const validate = async (w: ReturnType<typeof mountPage>) => {
  await w.find(".quiz-btn-validate").trigger("click")
  await nextTick()
}

beforeEach(() => sessionStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe("QuizQuestion — choice", () => {
  it("renders answers in source order when shuffle is off", async () => {
    const w = mountPage([SINGLE])
    await nextTick()
    expect(answerTexts(w)).toEqual(["Madrid", "Paris", "Berlin"])
  })

  it("single choice: selecting another answer replaces the first", async () => {
    const w = mountPage([SINGLE])
    await nextTick()
    await pick(w, 0, "Madrid")
    await pick(w, 0, "Paris")
    expect(w.findAll(".quiz-answer.selected")).toHaveLength(1)
    expect(w.find(".quiz-answer.selected").text()).toContain("Paris")
  })

  it("multi choice: shows hint and toggles", async () => {
    const w = mountPage([MULTI])
    await nextTick()
    expect(w.find(".quiz-hint").exists()).toBe(true)
    await pick(w, 0, "Vue")
    await pick(w, 0, "React")
    expect(w.findAll(".quiz-answer.selected")).toHaveLength(2)
    await pick(w, 0, "Vue")
    expect(w.findAll(".quiz-answer.selected")).toHaveLength(1)
  })

  it("keyboard Enter and Space select an answer", async () => {
    const w = mountPage([SINGLE])
    await nextTick()
    const items = w.findAll(".quiz-answer")
    await items[0].trigger("keydown", { key: "Enter" })
    expect(items[0].classes()).toContain("selected")
    await items[2].trigger("keydown", { key: " " })
    expect(items[2].classes()).toContain("selected")
  })

  it("validate stays disabled until every question is answered", async () => {
    const w = mountPage([SINGLE, MULTI])
    await nextTick()
    const btn = () => w.find(".quiz-btn-validate")
    expect(btn().attributes("disabled")).toBeDefined()
    await pick(w, 0, "Paris")
    expect(btn().attributes("disabled")).toBeDefined()
    await pick(w, 1, "Vue")
    expect(btn().attributes("disabled")).toBeUndefined()
  })

  it("scores single choice correctly and marks wrong/missed answers", async () => {
    const w = mountPage([SINGLE])
    await nextTick()
    await pick(w, 0, "Madrid")
    await validate(w)
    expect(w.find(".quiz-score-value").text()).toBe("0 / 1")
    expect(w.find(".quiz-answer.wrong").text()).toContain("Madrid")
    expect(w.find(".quiz-answer.missed").text()).toContain("Paris")
  })

  it("multi choice needs the exact set (partial and superset are wrong)", async () => {
    const partial = mountPage([MULTI])
    await nextTick()
    await pick(partial, 0, "Vue")
    await validate(partial)
    expect(partial.find(".quiz-score-value").text()).toBe("0 / 1")
    partial.unmount()
    sessionStorage.clear()

    const superset = mountPage([MULTI])
    await nextTick()
    for (const t of ["Vue", "React", "Django"]) await pick(superset, 0, t)
    await validate(superset)
    expect(superset.find(".quiz-score-value").text()).toBe("0 / 1")
    superset.unmount()
    sessionStorage.clear()

    const exact = mountPage([MULTI])
    await nextTick()
    await pick(exact, 0, "Vue")
    await pick(exact, 0, "React")
    await validate(exact)
    expect(exact.find(".quiz-score-value").text()).toBe("1 / 1")
  })

  it("selection is locked after validation", async () => {
    const w = mountPage([SINGLE])
    await nextTick()
    await pick(w, 0, "Paris")
    await validate(w)
    await pick(w, 0, "Madrid")
    expect(w.find(".quiz-answer.correct").text()).toContain("Paris")
    expect(w.find(".quiz-answer.wrong").exists()).toBe(false)
  })

  it("shows the explanation only after validation", async () => {
    const w = mountPage([[...SINGLE, "explanation: Because **Paris**"]])
    await nextTick()
    await pick(w, 0, "Paris")
    expect(w.find(".quiz-explanation").exists()).toBe(false)
    await validate(w)
    expect(w.find(".quiz-explanation strong:nth-of-type(2)").text()).toBe("Paris")
  })

  it("renders inline code/bold/italic in question and answers", async () => {
    const w = mountPage([["question: Use `git` **now**?", "answer-correct: *yes*", "answer: no"]])
    await nextTick()
    expect(w.find("legend code").text()).toBe("git")
    expect(w.find("legend strong").text()).toBe("now")
    expect(w.find(".quiz-answer-text em").text()).toBe("yes")
  })

  it("does not inject raw HTML from quiz text", async () => {
    const w = mountPage([["question: <img src=x onerror=alert(1)>?", "answer-correct: <b>x</b>", "answer: y"]])
    await nextTick()
    expect(w.find("img").exists()).toBe(false)
    expect(w.find(".quiz-answer-text b").exists()).toBe(false)
  })
})

describe("QuizQuestion — shuffle", () => {
  it("keeps all answers (permutation) and scores by identity, not position", async () => {
    const w = mountPage([SHUFFLED])
    await nextTick()
    expect([...answerTexts(w)].sort()).toEqual(["A", "B", "C", "D", "E", "F"])
    await pick(w, 0, "B")
    await validate(w)
    expect(w.find(".quiz-score-value").text()).toBe("1 / 1")
    expect(w.find(".quiz-answer.correct").text()).toContain("B")
  })

  it("restores the SAME answer after reload even though order is reshuffled", async () => {
    // force different orders on first and second mount
    const rnd = vi.spyOn(Math, "random")
    rnd.mockReturnValue(0)
    const first = mountPage([SHUFFLED])
    await nextTick()
    await pick(first, 0, "C")
    await validate(first)
    first.unmount()

    rnd.mockReturnValue(0.999)
    const second = mountPage([SHUFFLED])
    await nextTick()
    await nextTick()
    expect(second.find(".quiz-answer.wrong").text()).toContain("C")
    expect(second.find(".quiz-answer.missed").text()).toContain("B")
    expect(second.find(".quiz-score-value").text()).toBe("0 / 1")
  })

  it("restores a correct pick as correct after reshuffle", async () => {
    const rnd = vi.spyOn(Math, "random")
    rnd.mockReturnValue(0)
    const first = mountPage([SHUFFLED])
    await nextTick()
    await pick(first, 0, "B")
    await validate(first)
    first.unmount()

    rnd.mockReturnValue(0.999)
    const second = mountPage([SHUFFLED])
    await nextTick()
    await nextTick()
    expect(second.find(".quiz-score-value").text()).toBe("1 / 1")
  })

  it("re-shuffles on reset and clears selection", async () => {
    const w = mountPage([SHUFFLED])
    await nextTick()
    await pick(w, 0, "A")
    await validate(w)
    await w.find(".quiz-btn-reset").trigger("click")
    await nextTick()
    expect(w.findAll(".quiz-answer.selected")).toHaveLength(0)
    expect(w.find(".quiz-btn-validate").exists()).toBe(true)
  })
})

describe("QuizQuestion — input", () => {
  const type = async (w: ReturnType<typeof mountPage>, v: string) => {
    await w.find("input").setValue(v)
  }

  it.each([
    ["git init", true],
    ["  GIT INIT  ", true],
    ["git    init", true],
    ["git init -b main", true],
    ["GiT InIt -B MAIN", true],
    ["git", false],
    ["git initx", false],
  ])("input %j → correct=%s", async (value, ok) => {
    const w = mountPage([INPUT])
    await nextTick()
    await type(w, value)
    await validate(w)
    expect(w.find(".quiz-score-value").text()).toBe(ok ? "1 / 1" : "0 / 1")
  })

  it("accepts answers without capitals or accents", async () => {
    const w = mountPage([["question: Q?", "answer-input: Réseau Privé Virtuel"]])
    await nextTick()
    await type(w, "reseau prive virtuel")
    await validate(w)
    expect(w.find(".quiz-score-value").text()).toBe("1 / 1")
  })

  it("whitespace-only input counts as unanswered", async () => {
    const w = mountPage([INPUT])
    await nextTick()
    await type(w, "   ")
    expect(w.find(".quiz-btn-validate").attributes("disabled")).toBeDefined()
  })

  it("shows the expected answer when wrong, hides it when right", async () => {
    const wrong = mountPage([INPUT])
    await nextTick()
    await type(wrong, "nope")
    await validate(wrong)
    expect(wrong.find(".quiz-expected code").text()).toBe("git init")
    expect(wrong.find("input").attributes("disabled")).toBeDefined()
    wrong.unmount()
    sessionStorage.clear()

    const right = mountPage([INPUT])
    await nextTick()
    await type(right, "git init")
    await validate(right)
    expect(right.find(".quiz-expected").exists()).toBe(false)
  })

  it("Enter in the input does not submit/validate", async () => {
    const w = mountPage([INPUT])
    await nextTick()
    await type(w, "git init")
    await w.find("input").trigger("keydown", { key: "Enter" })
    expect(w.find(".quiz-score").exists()).toBe(false)
  })
})

describe("QuizPage — progress, persistence, reset", () => {
  it("progress label and bar follow answered count", async () => {
    const w = mountPage([SINGLE, MULTI, INPUT])
    await nextTick()
    expect(w.find(".quiz-progress-label").text()).toBe("0 / 3 answered")
    await pick(w, 0, "Paris")
    expect(w.find(".quiz-progress-label").text()).toBe("1 / 3 answered")
    expect((w.find(".quiz-progress-fill").element as HTMLElement).style.width).toBe("33%")
  })

  it("score counts per question across mixed types", async () => {
    const w = mountPage([SINGLE, MULTI, INPUT])
    await nextTick()
    await pick(w, 0, "Paris")
    await pick(w, 1, "Django")
    await w.findAll("input")[0].setValue("git init")
    await validate(w)
    expect(w.find(".quiz-score-value").text()).toBe("2 / 3")
    expect(w.find(".quiz-score-label").text()).toContain("67%")
  })

  it("persists answers + validated state across remount", async () => {
    const a = mountPage([SINGLE, INPUT])
    await nextTick()
    await pick(a, 0, "Berlin")
    await a.find("input").setValue("git init")
    await validate(a)
    a.unmount()

    const b = mountPage([SINGLE, INPUT])
    await nextTick()
    await nextTick()
    expect(b.find(".quiz-score-value").text()).toBe("1 / 2")
    expect(b.find(".quiz-answer.wrong").text()).toContain("Berlin")
    expect((b.find("input").element as HTMLInputElement).value).toBe("git init")
  })

  it("persists in-progress (unvalidated) answers", async () => {
    const a = mountPage([SINGLE])
    await nextTick()
    await pick(a, 0, "Madrid")
    a.unmount()
    const b = mountPage([SINGLE])
    await nextTick()
    await nextTick()
    expect(b.find(".quiz-answer.selected").text()).toContain("Madrid")
    expect(b.find(".quiz-score").exists()).toBe(false)
  })

  it("reset wipes selection, input, stored state and unlocks", async () => {
    const w = mountPage([SINGLE, INPUT])
    await nextTick()
    await pick(w, 0, "Paris")
    await w.find("input").setValue("git init")
    await validate(w)
    await w.find(".quiz-btn-reset").trigger("click")
    await nextTick()
    expect(w.findAll(".quiz-answer.selected")).toHaveLength(0)
    expect((w.find("input").element as HTMLInputElement).value).toBe("")
    expect(w.find("input").attributes("disabled")).toBeUndefined()
    w.unmount()
    // nothing meaningful left to restore
    const again = mountPage([SINGLE, INPUT])
    await nextTick()
    await nextTick()
    expect(again.find(".quiz-score").exists()).toBe(false)
    expect(again.findAll(".quiz-answer.selected")).toHaveLength(0)
  })

  it("survives corrupted sessionStorage", async () => {
    sessionStorage.setItem("quiz-state:" + window.location.pathname, "{not json")
    sessionStorage.setItem("quiz-state:" + window.location.pathname + ":q0", "{not json")
    const w = mountPage([SINGLE])
    await nextTick()
    expect(w.find(".quiz-score").exists()).toBe(false)
    expect(w.findAll(".quiz-answer")).toHaveLength(3)
  })

  it("ignores saved answer whose type no longer matches the question", async () => {
    sessionStorage.setItem(
      "quiz-state:" + window.location.pathname + ":q0",
      JSON.stringify({ type: "input", input: "x" }),
    )
    const w = mountPage([SINGLE])
    await nextTick()
    await nextTick()
    expect(w.findAll(".quiz-answer.selected")).toHaveLength(0)
  })

  it("ignores saved selection indices that are out of range", async () => {
    sessionStorage.setItem(
      "quiz-state:" + window.location.pathname + ":q0",
      JSON.stringify({ type: "choice", selected: [42, -1] }),
    )
    const w = mountPage([SINGLE])
    await nextTick()
    await nextTick()
    expect(w.find(".quiz-btn-validate").attributes("disabled")).toBeDefined()
  })

  it("unmounted questions no longer count toward totals", async () => {
    const { h, defineComponent, ref } = await import("vue")
    const { mount } = await import("@vue/test-utils")
    const { default: QuizPage } = await import("../QuizPage.vue")
    const { default: QuizQuestion } = await import("../QuizQuestion.vue")
    const { getLocale } = await import("../locales")
    const { quizJson } = await import("./helpers")
    const show = ref(true)
    const W = defineComponent({
      render: () =>
        h(QuizPage, null, {
          default: () => [
            h(QuizQuestion, { dataQuiz: quizJson(SINGLE) }),
            show.value ? h(QuizQuestion, { dataQuiz: quizJson(MULTI) }) : null,
          ],
        }),
    })
    const w = mount(W, { global: { provide: { "quiz-locale": getLocale("en") } } })
    await nextTick()
    expect(w.find(".quiz-progress-label").text()).toBe("0 / 2 answered")
    show.value = false
    await nextTick()
    expect(w.find(".quiz-progress-label").text()).toBe("0 / 1 answered")
  })

  it("does not render a broken question and does not count it", async () => {
    const { h, defineComponent } = await import("vue")
    const { mount } = await import("@vue/test-utils")
    const { default: QuizPage } = await import("../QuizPage.vue")
    const { default: QuizQuestion } = await import("../QuizQuestion.vue")
    const { getLocale } = await import("../locales")
    const W = defineComponent({
      render: () => h(QuizPage, null, { default: () => [h(QuizQuestion, { dataQuiz: "{oops" })] }),
    })
    const w = mount(W, { global: { provide: { "quiz-locale": getLocale("en") } } })
    await nextTick()
    expect(w.find(".quiz-question").exists()).toBe(false)
    expect(w.find(".quiz-btn-validate").attributes("disabled")).toBeDefined()
  })

  it("localises UI (fr)", async () => {
    const w = mountPage([SINGLE], "fr")
    await nextTick()
    expect(w.find(".quiz-btn-validate").text()).toBe("Valider")
  })
})
