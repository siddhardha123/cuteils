'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  function update(value: string) { setInput(value); setOutput(''); setError('') }
  function format() {
    try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); setError('') }
    catch (error) { setOutput(''); setError(error instanceof Error ? error.message : 'Invalid JSON') }
  }
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ToolPanel title="Input JSON" actions={<><Button variant="ghost" size="sm" onClick={() => update('{"name":"Cuteils","tools":["JSON","Time","Auth"]}')}>Example</Button><Button variant="ghost" size="sm" onClick={() => update('')} disabled={!input}>Clear</Button></>}>
        <Textarea aria-label="Input JSON" placeholder="Paste your JSON here..." value={input} onChange={event => update(event.target.value)} className="min-h-80 font-mono" spellCheck={false} />
        <ToolError message={error} />
        <Button onClick={format} disabled={!input.trim()}>Format JSON</Button>
      </ToolPanel>
      <ToolPanel title="Formatted JSON" actions={<CopyButton value={output} />}><ToolOutput value={output} placeholder="Paste JSON and choose Format JSON to see the result." /></ToolPanel>
    </div>
  )
}
