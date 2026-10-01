'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'
import { compareText } from '@/lib/text-diff'

export default function TextDiff() {
  const [original, setOriginal] = useState('')
  const [updated, setUpdated] = useState('')
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof compareText> | null>(null)
  const [error, setError] = useState('')
  function resetResult() { setResult(null); setError('') }
  function compare() {
    try { setResult(compareText(original, updated, ignoreWhitespace)); setError('') }
    catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : 'Could not compare these texts.') }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => { setOriginal('API_URL=https://old.example.com\nLOG_LEVEL=info\n'); setUpdated('API_URL=https://api.example.com\nLOG_LEVEL=info\nRETRIES=3\n'); resetResult() }}>Example</Button>
        <Button variant="ghost" size="sm" disabled={!original && !updated} onClick={() => { setOriginal(''); setUpdated(''); resetResult() }}>Clear</Button>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ToolPanel title="Original text"><Textarea aria-label="Original text" value={original} onChange={event => { setOriginal(event.target.value); resetResult() }} placeholder="Paste original text..." className="min-h-64 font-mono" spellCheck={false} /></ToolPanel>
        <ToolPanel title="Updated text"><Textarea aria-label="Updated text" value={updated} onChange={event => { setUpdated(event.target.value); resetResult() }} placeholder="Paste updated text..." className="min-h-64 font-mono" spellCheck={false} /></ToolPanel>
      </div>
      <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={ignoreWhitespace} onChange={event => { setIgnoreWhitespace(event.target.checked); resetResult() }} className="h-4 w-4 accent-pink-500" />Ignore leading and trailing whitespace</label>
      <ToolError message={error} />
      <Button onClick={compare} disabled={!original && !updated}>Compare text</Button>
      <ToolPanel title="Differences" actions={<CopyButton value={result?.text ?? ''} />}>
        {result && !result.equal ? <>
          <p role="status" className="text-sm"><span className="font-semibold text-green-800">+ {result.added} added</span> · <span className="font-semibold text-red-800">− {result.removed} removed</span></p>
          <div className="max-h-[36rem] overflow-auto border border-stone-200 font-mono text-sm">
            {result.lines.map((line, index) => <div key={index} className={`grid grid-cols-[2.5rem_2.5rem_1.5rem_minmax(0,1fr)] ${line.type === 'added' ? 'bg-green-50 text-green-900' : line.type === 'removed' ? 'bg-red-50 text-red-900' : 'bg-stone-50 text-stone-600'}`}>
              <span className="select-none px-1 py-1 text-right text-xs text-stone-500" aria-hidden="true">{line.oldLine}</span>
              <span className="select-none px-1 py-1 text-right text-xs text-stone-500" aria-hidden="true">{line.newLine}</span>
              <span className="px-1 py-1">{line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}</span>
              <span className="whitespace-pre-wrap break-words px-2 py-1">{line.text || ' '}{!line.hasNewline && <span className="ml-2 text-xs italic text-stone-500">(no final newline)</span>}</span>
            </div>)}
          </div>
        </> : <ToolOutput value={result?.text ?? ''} placeholder="Compare the inputs to see additions and removals. Either side can be empty." />}
        <p className="text-xs text-stone-500">Compares lines. Windows and Unix line endings are treated alike.</p>
      </ToolPanel>
    </div>
  )
}
