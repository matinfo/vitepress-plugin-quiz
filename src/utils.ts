/**
 * Inline markdown part — result of {@link parseRichText}.
 */
export type RichPart = { type: "text" | "bold" | "italic" | "code"; value: string }

/**
 * Parse inline markdown subsets: **bold**, *italic*, `code` → typed parts array.
 * Used for question titles, answer text, and explanations.
 */
export function parseRichText(text: string): RichPart[] {
  const parts: RichPart[] = []
  const re = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`([^`]+)`)/g
  let last = 0
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) })
    if (m[2]) parts.push({ type: "bold", value: m[2] })
    else if (m[4]) parts.push({ type: "italic", value: m[4] })
    else if (m[6]) parts.push({ type: "code", value: m[6] })
    last = re.lastIndex
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) })
  return parts
}
