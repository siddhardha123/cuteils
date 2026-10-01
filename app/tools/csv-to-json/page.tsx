'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton, DownloadButton, ToolError, ToolOutput, ToolPanel, ToolSelect } from '@/components/ToolWorkspace'
import { csvToJson } from '@/lib/csv-utils'

export default function CsvToJson() {
  const [input, setInput] = useState('')
  const [delimiter, setDelimiter] = useState('')
  const [inferTypes, setInferTypes] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof csvToJson> | null>(null)
  const [error, setError] = useState('')
  function resetResult() { setResult(null); setError('') }
  function update(value: string) { setInput(value); resetResult() }
  function convert() {
    try { setResult(csvToJson(input, delimiter, inferTypes)); setError('') }
    catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : 'Invalid CSV.') }
  }
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ToolPanel title="Input CSV" actions={<>
        <Button variant="ghost" size="sm" onClick={() => update('name,role,active\nSid,Developer,true\nAlex,Designer,false')}>Example</Button>
        <Button variant="ghost" size="sm" disabled={!input} onClick={() => update('')}>Clear</Button>
      </>}>
        <ToolSelect id="csv-delimiter" label="Delimiter" value={delimiter} onChange={value => { setDelimiter(value); resetResult() }} options={[{ value: '', label: 'Auto-detect' }, { value: ',', label: 'Comma (,)' }, { value: ';', label: 'Semicolon (;)' }, { value: '\t', label: 'Tab' }, { value: '|', label: 'Pipe (|)' }]} />
        <Textarea aria-label="Input CSV" value={input} onChange={event => update(event.target.value)} placeholder="Paste CSV with column headers..." className="min-h-64 font-mono" spellCheck={false} />
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={inferTypes} onChange={event => { setInferTypes(event.target.checked); resetResult() }} className="mt-1 h-4 w-4 shrink-0 accent-pink-500" />Detect numbers, true/false, and null</label>
        <ToolError message={error} />
        <Button onClick={convert} disabled={!input.trim()}>Convert to JSON</Button>
        <p className="text-xs text-stone-500">The first row supplies unique column names. Values stay strings by default; blank rows are skipped.</p>
      </ToolPanel>
      <ToolPanel title="JSON output" actions={<><DownloadButton value={result?.json ?? ''} filename="cuteils.json" mimeType="application/json;charset=utf-8" /><CopyButton value={result?.json ?? ''} /></>}>
        <ToolOutput value={result?.json ?? ''} placeholder="Convert CSV to preview, copy, or download JSON." />
        {result && <p role="status" className="text-xs text-stone-500">{result.rows} {result.rows === 1 ? 'row' : 'rows'} · {result.columns} {result.columns === 1 ? 'column' : 'columns'}</p>}
      </ToolPanel>
    </div>
  )
}
