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
