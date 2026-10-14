import { describe, it, expect } from "vitest"
import { parseRichText } from "../utils"

describe("parseRichText", () => {
  it("returns a single text part for plain text", () => {
    expect(parseRichText("hello world")).toEqual([{ type: "text", value: "hello world" }])
  })

  it("returns empty array for empty string", () => {
    expect(parseRichText("")).toEqual([])
  })

  it("parses bold markers", () => {
    expect(parseRichText("**bold**")).toEqual([{ type: "bold", value: "bold" }])
  })

  it("parses italic markers", () => {
    expect(parseRichText("*italic*")).toEqual([{ type: "italic", value: "italic" }])
  })

  it("parses inline code", () => {
    expect(parseRichText("`code`")).toEqual([{ type: "code", value: "code" }])
  })

  it("parses mixed content with surrounding text", () => {
    expect(parseRichText("Use **npm** or `yarn`")).toEqual([
      { type: "text", value: "Use " },
      { type: "bold", value: "npm" },
      { type: "text", value: " or " },
      { type: "code", value: "yarn" },
    ])
  })

  it("handles bold before italic", () => {
    expect(parseRichText("**bold** and *italic*")).toEqual([
      { type: "bold", value: "bold" },
      { type: "text", value: " and " },
      { type: "italic", value: "italic" },
    ])
  })

  it("preserves trailing plain text", () => {
    const parts = parseRichText("`foo` bar")
    expect(parts.at(-1)).toEqual({ type: "text", value: " bar" })
  })

  it("handles multiple bold spans", () => {
    expect(parseRichText("**a** **b**")).toEqual([
      { type: "bold", value: "a" },
      { type: "text", value: " " },
      { type: "bold", value: "b" },
    ])
  })
})

import { normalizeInput } from "../utils"

describe("parseRichText — false positives", () => {
  it("does not italicise spaced asterisks like 2 * 3 * 4", () => {
    expect(parseRichText("2 * 3 * 4")).toEqual([{ type: "text", value: "2 * 3 * 4" }])
  })
  it("keeps asterisks inside code", () => {
    expect(parseRichText("`a*b*`")).toEqual([{ type: "code", value: "a*b*" }])
  })
  it("leaves unmatched markers as text", () => {
    expect(parseRichText("a ** b")).toEqual([{ type: "text", value: "a ** b" }])
  })
})

describe("normalizeInput", () => {
  it("trims, lowercases, collapses whitespace", () => {
    expect(normalizeInput("  Git \t  INIT\n")).toBe("git init")
  })
  it("treats composed and decomposed accents as equal", () => {
    expect(normalizeInput("é")).toBe(normalizeInput("é"))
  })
  it("ignores accents and capitals", () => {
    expect(normalizeInput("Réseau Privé Virtuel")).toBe(normalizeInput("reseau prive virtuel"))
    expect(normalizeInput("ÇA")).toBe("ca")
  })
  it("keeps distinct letters distinct", () => {
    expect(normalizeInput("ß")).not.toBe(normalizeInput("s"))
  })
})
