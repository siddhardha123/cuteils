export function jsonToCsv(input: string): string {
  const rows: unknown = JSON.parse(input)
  if (!Array.isArray(rows) || !rows.length || rows.some(row => !row || typeof row !== 'object' || Array.isArray(row))) {
    throw new Error('Input must be a non-empty array of objects.')
  }
  const headers = [...new Set(rows.flatMap(row => Object.keys(row)))]
  if (!headers.length) throw new Error('The objects must contain at least one column.')
  const escape = (value: unknown) => {
    const text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value)
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  return [headers.map(escape).join(','), ...rows.map(row => headers.map(header => escape(Object.hasOwn(row, header) ? row[header] : undefined)).join(','))].join('\r\n')
}

export function correctJson(input: string): string {
  try { return JSON.stringify(JSON.parse(input), null, 2) } catch { /* Repair the supported syntax below. */ }
  const strings: string[] = []
  let masked = ''
  for (let index = 0; index < input.length; index++) {
    const quote = input[index]
    if (quote !== '"' && quote !== "'") { masked += quote; continue }
    let value = '"'
    let closed = false
    while (++index < input.length) {
      const character = input[index]
      if (character === quote) { closed = true; break }
      if (character === '\\') {
        const next = input[++index]
        if (next === undefined) throw new Error('Unterminated string.')
        value += quote === "'" && next === "'" ? "'" : `\\${next}`
      } else value += character === '"' ? '\\"' : character
    }
    if (!closed) throw new Error('Unterminated string.')
    value += '"'
    masked += `\u0000${strings.length}\u0000`
    strings.push(value)
  }
  const repaired = masked
    .replace(/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, '$1"$2"$3')
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/\u0000(\d+)\u0000/g, (_, index: string) => strings[Number(index)])
  return JSON.stringify(JSON.parse(repaired), null, 2)
}

export function compareJson(left: string, right: string): string {
  let original: unknown, updated: unknown
  try { original = JSON.parse(left) } catch { throw new Error('Original JSON is invalid.') }
  try { updated = JSON.parse(right) } catch { throw new Error('Updated JSON is invalid.') }
  const changes: string[] = []
  const display = (value: unknown) => JSON.stringify(value)
  function walk(before: unknown, after: unknown, path: string) {
    if (before === after) return
    if (before !== null && after !== null && typeof before === 'object' && typeof after === 'object' && Array.isArray(before) === Array.isArray(after)) {
      const a = before as Record<string, unknown>, b = after as Record<string, unknown>
      for (const key of [...new Set([...Object.keys(a), ...Object.keys(b)])]) {
        const childPath = Array.isArray(before) ? `${path}[${key}]` : `${path}[${JSON.stringify(key)}]`
        if (!Object.hasOwn(a, key)) changes.push(`Added ${childPath}: ${display(b[key])}`)
        else if (!Object.hasOwn(b, key)) changes.push(`Removed ${childPath}: ${display(a[key])}`)
        else walk(a[key], b[key], childPath)
      }
    } else changes.push(`Changed ${path}: ${display(before)} → ${display(after)}`)
  }
  walk(original, updated, '$')
  return changes.length ? changes.join('\n') : 'No differences. The JSON values are equal.'
}

export function decodeJwt(token: string): { header: Record<string, unknown>; payload: Record<string, unknown> } {
  const parts = token.split('.')
  if (parts.length !== 3 || !parts[0] || !parts[1]) throw new Error('A JWT must have three dot-separated parts.')
  function decode(part: string): Record<string, unknown> {
    if (!/^[A-Za-z0-9_-]+$/.test(part)) throw new Error('Invalid Base64URL encoding.')
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), character => character.charCodeAt(0))
    const result: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('JWT header and payload must be JSON objects.')
    return result as Record<string, unknown>
  }
  try { return { header: decode(parts[0]), payload: decode(parts[1]) } }
  catch { throw new Error('Could not decode this token. Check its Base64URL header and payload.') }
}
