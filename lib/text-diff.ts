import { diffLines } from 'diff'

export type DiffLine = { type: 'added' | 'removed' | 'unchanged'; text: string; oldLine: number | null; newLine: number | null; hasNewline: boolean }

export function compareText(original: string, updated: string, ignoreWhitespace = false) {
  if (original.length + updated.length > 500_000) throw new Error('Use less than 500 KB of combined text.')
  const changes = diffLines(original, updated, { ignoreWhitespace, stripTrailingCr: true, timeout: 300 })
  if (!changes) throw new Error('These inputs are too different to compare quickly. Try a smaller section.')
  let oldLine = 1, newLine = 1, added = 0, removed = 0
  const lines: DiffLine[] = []
  for (const part of changes) {
    const values = part.value.split('\n')
    if (part.value.endsWith('\n')) values.pop()
    for (let index = 0; index < values.length; index++) {
      const type = part.added ? 'added' : part.removed ? 'removed' : 'unchanged'
      const hasNewline = index < values.length - 1 || part.value.endsWith('\n')
      lines.push({ type, text: values[index], oldLine: part.added ? null : oldLine++, newLine: part.removed ? null : newLine++, hasNewline })
      if (part.added) added++
      if (part.removed) removed++
    }
  }
  const equal = added === 0 && removed === 0
  const text = equal ? 'No differences. The texts are equal with the selected options.' : lines.map(line => `${line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '} ${line.text}${line.hasNewline ? '' : '\n\\ No newline at end of file'}`).join('\n')
  return { lines, added, removed, equal, text }
}
