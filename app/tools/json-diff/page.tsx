'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'
import { compareJson } from '@/lib/tool-utils'

export default function JsonDiff() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  function update(side: 'left' | 'right', value: string) {
    if (side === 'left') setLeft(value); else setRight(value)
    setOutput(''); setError('')
  }
  function compare() {
    try { setOutput(compareJson(left, right)); setError('') }
    catch (error) { setOutput(''); setError(error instanceof Error ? error.message : 'Invalid JSON') }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => { update('left', '{"name":"Cuteils","version":1}'); update('right', '{"name":"Cuteils","version":2,"active":true}') }}>Example</Button>
        <Button variant="ghost" size="sm" disabled={!left && !right} onClick={() => { update('left', ''); update('right', '') }}>Clear</Button>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ToolPanel title="Original JSON"><Textarea aria-label="Original JSON" placeholder="Paste original JSON..." value={left} onChange={event => update('left', event.target.value)} className="min-h-64 font-mono" spellCheck={false} /></ToolPanel>
        <ToolPanel title="Updated JSON"><Textarea aria-label="Updated JSON" placeholder="Paste updated JSON..." value={right} onChange={event => update('right', event.target.value)} className="min-h-64 font-mono" spellCheck={false} /></ToolPanel>
      </div>
      <ToolError message={error} />
      <Button disabled={!left.trim() || !right.trim()} onClick={compare}>Compare JSON</Button>
      <ToolPanel title="Differences" actions={<CopyButton value={output} />}>
        <ToolOutput value={output} placeholder="Compare both inputs to see added, removed, and changed values." />
        <p className="text-xs text-stone-500">Object key order is ignored. Arrays are compared by index.</p>
      </ToolPanel>
    </div>
  )
}
