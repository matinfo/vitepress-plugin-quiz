import { describe, it, expect } from "vitest"
import { getLocale, locales } from "../locales"

const ALL_LOCALES = ["en", "fr", "de", "it", "es"] as const

describe("locales", () => {
  it("exports all 5 locales", () => {
    expect(Object.keys(locales)).toEqual(expect.arrayContaining([...ALL_LOCALES]))
  })

  it("every locale has the required keys", () => {
    const required: (keyof (typeof locales)["en"])[] = [
      "answered",
      "validate",
      "reset",
      "correctAnswers",
      "multipleHint",
      "explanation",
      "inputHint",
      "inputPlaceholder",
      "expectedAnswer",
    ]
    for (const code of ALL_LOCALES) {
      for (const key of required) {
        expect(locales[code], `locale ${code} missing key "${key}"`).toHaveProperty(key)
      }
    }
  })
})

describe("getLocale", () => {
  it("returns the correct locale for a known language code", () => {
    expect(getLocale("fr")).toBe(locales.fr)
    expect(getLocale("de")).toBe(locales.de)
  })

  it("falls back to English for an unknown language code", () => {
    expect(getLocale("xx")).toBe(locales.en)
    expect(getLocale("zz-TZ")).toBe(locales.en)
  })

  it("falls back to English when no argument is supplied", () => {
    expect(getLocale()).toBe(locales.en)
  })

  it("en correctAnswers singular", () => {
    expect(locales.en.correctAnswers(1)).toBe("correct answer")
  })

  it("en correctAnswers plural", () => {
    expect(locales.en.correctAnswers(2)).toBe("correct answers")
    expect(locales.en.correctAnswers(0)).toBe("correct answers")
  })

  it("fr correctAnswers singular", () => {
    expect(locales.fr.correctAnswers(1)).toBe("réponse correcte")
  })

  it("fr correctAnswers plural", () => {
    expect(locales.fr.correctAnswers(3)).toBe("réponses correctes")
  })
})
