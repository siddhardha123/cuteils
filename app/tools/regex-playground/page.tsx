'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'
import type { RegexResult } from '@/lib/regex-utils'

const flagsAvailable = [{ value: 'g', label: 'Global' }, { value: 'i', label: 'Ignore case' }, { value: 'm', label: 'Multiline' }, { value: 's', label: 'Dot all' }, { value: 'u', label: 'Unicode' }, { value: 'y', label: 'Sticky' }]

export default function RegexPlayground() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('')
  const [replacement, setReplacement] = useState('')
  const [replace, setReplace] = useState(false)
  const [result, setResult] = useState<RegexResult | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const worker = useRef<Worker | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function stop() {
    worker.current?.terminate(); worker.current = null
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  useEffect(() => () => {
    worker.current?.terminate()
    if (timer.current) clearTimeout(timer.current)
  }, [])
  function resetResult() { stop(); setBusy(false); setResult(null); setError('') }
  function run() {
    resetResult(); setBusy(true)
    try {
      const active = new Worker(new URL('../../../lib/regex.worker.ts', import.meta.url))
      worker.current = active
      function fail(message: string) { if (worker.current !== active) return; stop(); setBusy(false); setError(message) }
      timer.current = setTimeout(() => fail('The regex worker could not start. Reload the page and try again.'), 10_000)
      active.onmessage = (event: MessageEvent<{ ready?: boolean; result?: RegexResult; error?: string }>) => {
        if (worker.current !== active) return
        if (event.data.ready) {
          if (timer.current) clearTimeout(timer.current)
          timer.current = setTimeout(() => fail('This pattern took too long. Simplify the pattern or use shorter test text.'), 1000)
          active.postMessage({ pattern, flags, text, replacement: replace ? replacement : null })
          return
        }
        stop(); setBusy(false)
        if (event.data.error) setError(event.data.error)
        else if (event.data.result) setResult(event.data.result)
      }
      active.onerror = event => { event.preventDefault(); fail('The regex worker failed. Reload the page and try again.') }
    } catch (cause) { stop(); setBusy(false); setError(cause instanceof Error ? cause.message : 'Could not start the regex tester.') }
  }
  const matchesText = result ? result.matches.length ? JSON.stringify(result.matches, null, 2) : 'No matches found.' : ''
  return (
    <div className="space-y-6">
      <ToolPanel title="Pattern and flags" actions={<>
        <Button variant="ghost" size="sm" onClick={() => { setPattern('(?<name>[A-Za-z]+)@(?<domain>[A-Za-z.]+)'); setFlags('g'); setText('Contact sid@example.com or alex@cuteils.dev'); setReplacement('$<name> at $<domain>'); resetResult() }}>Example</Button>
        <Button variant="ghost" size="sm" disabled={!pattern && !text} onClick={() => { setPattern(''); setText(''); setReplacement(''); resetResult() }}>Clear</Button>
      </>}>
        <div className="space-y-2"><Label htmlFor="regex-pattern">JavaScript pattern (without / delimiters)</Label><Input id="regex-pattern" value={pattern} onChange={event => { setPattern(event.target.value); resetResult() }} placeholder="e.g. (?<name>[A-Za-z]+)@(?<domain>[A-Za-z.]+)" className="font-mono" spellCheck={false} /></div>
        <fieldset className="flex flex-wrap gap-x-5 gap-y-3"><legend className="mb-3 text-sm font-medium">Flags</legend>{flagsAvailable.map(flag => <label key={flag.value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={flags.includes(flag.value)} onChange={event => { setFlags(event.target.checked ? flags + flag.value : flags.replace(flag.value, '')); resetResult() }} className="h-4 w-4 accent-pink-500" /><span className="font-mono font-bold">{flag.value}</span>{flag.label}</label>)}</fieldset>
        <ToolError message={error} />
      </ToolPanel>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ToolPanel title="Test text">
          <Textarea aria-label="Test text" value={text} onChange={event => { setText(event.target.value); resetResult() }} placeholder="Paste text to test the pattern against..." className="min-h-64 font-mono" spellCheck={false} />
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={replace} onChange={event => { setReplace(event.target.checked); resetResult() }} className="h-4 w-4 accent-pink-500" />Preview replacement</label>
          {replace && <div className="space-y-2"><Label htmlFor="regex-replacement">Replacement (may be empty)</Label><Input id="regex-replacement" value={replacement} onChange={event => { setReplacement(event.target.value); resetResult() }} placeholder="e.g. $1 or $<name>" className="font-mono" spellCheck={false} /><p className="text-xs text-stone-500">Supports JavaScript replacement tokens such as $1, $&amp;, and $&lt;name&gt;.</p></div>}
          <div className="flex flex-wrap gap-3"><Button onClick={run} disabled={busy}>{busy ? 'Testing…' : 'Test regex'}</Button>{busy && <Button variant="outline" onClick={resetResult}>Cancel</Button>}</div>
          <p className="text-xs text-stone-500">Match positions count UTF-16 characters. Empty patterns are allowed. Slow patterns stop after one second.</p>
        </ToolPanel>
        <ToolPanel title="Matches and captures" actions={<CopyButton value={matchesText} />}>
          {busy ? <p role="status" className="py-20 text-center text-sm text-stone-500">Testing the pattern…</p> : <ToolOutput value={matchesText} placeholder="Test a regex to inspect its matches and capture groups." />}
          {result && <p role="status" className="text-sm text-stone-500">{result.matches.length} {result.matches.length === 1 ? 'match' : 'matches'}{result.truncated ? ' (showing the first 500)' : ''}</p>}
        </ToolPanel>
      </div>
      {result?.replacement !== null && result?.replacement !== undefined && <ToolPanel title="Replacement result" actions={<CopyButton value={result.replacement} />}>
        {result.replacement ? <ToolOutput value={result.replacement} /> : <p className="min-h-32 p-4 text-sm text-stone-500">The replacement produced an empty string.</p>}
      </ToolPanel>}
    </div>
  )
}
