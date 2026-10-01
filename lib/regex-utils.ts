export type RegexMatch = { value: string; index: number; groups: (string | null)[]; namedGroups: Record<string, string | null> }
export type RegexResult = { matches: RegexMatch[]; truncated: boolean; replacement: string | null }

export function testRegex(pattern: string, flags: string, text: string, replacement: string | null = null): RegexResult {
  if (pattern.length > 5000 || text.length > 200_000) throw new Error('Use a pattern under 5,000 characters and text under 200 KB.')
  if (!/^[gimsuy]*$/.test(flags) || new Set(flags).size !== flags.length) throw new Error('Use each supported flag (g, i, m, s, u, y) at most once.')
  const regex = new RegExp(pattern, flags)
  const matches: RegexMatch[] = []
  let truncated = false
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (matches.length === 500) { truncated = true; break }
    matches.push({ value: match[0], index: match.index, groups: match.slice(1).map(value => value ?? null), namedGroups: Object.fromEntries(Object.entries(match.groups ?? {}).map(([key, value]) => [key, value ?? null])) })
    if (!regex.global) break
    if (!match[0].length) {
      const position = regex.lastIndex
      const point = text.codePointAt(position)
      regex.lastIndex += regex.unicode && point !== undefined && point > 0xFFFF ? 2 : 1
    }
  }
  return { matches, truncated, replacement: replacement === null ? null : text.replace(new RegExp(pattern, flags), replacement) }
}
