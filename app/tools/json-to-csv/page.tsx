'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'
import { jsonToCsv } from '@/lib/tool-utils'

export default function JsonToCsv() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  function update(value: string) { setInput(value); setOutput(''); setError('') }
  function convert() {
    try { setOutput(jsonToCsv(input)); setError('') }
    catch (error) { setOutput(''); setError(error instanceof Error ? error.message : 'Invalid JSON') }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([output], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'cuteils.csv'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ToolPanel title="Input JSON" actions={<><Button variant="ghost" size="sm" onClick={() => update('[{"name":"Sid","role":"Developer"},{"name":"Alex","role":"Designer"}]')}>Example</Button><Button variant="ghost" size="sm" onClick={() => update('')} disabled={!input}>Clear</Button></>}>
        <Textarea aria-label="Input JSON" placeholder="Paste an array of JSON objects..." value={input} onChange={event => update(event.target.value)} className="min-h-80 font-mono" spellCheck={false} />
        <ToolError message={error} />
        <Button onClick={convert} disabled={!input.trim()}>Convert to CSV</Button>
      </ToolPanel>
      <ToolPanel title="CSV output" actions={<><Button variant="ghost" size="sm" disabled={!output} onClick={download}><Download />Download</Button><CopyButton value={output} /></>}>
        <ToolOutput value={output} placeholder="Convert your JSON to preview, copy, or download CSV." />
        <p className="text-xs text-stone-500">Uses columns from every row. Nested values are serialized as JSON.</p>
      </ToolPanel>
    </div>
  )
}
