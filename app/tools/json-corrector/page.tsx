'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'
import { correctJson } from '@/lib/tool-utils'

export default function JsonCorrector() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  function update(value: string) { setInput(value); setOutput(''); setError('') }
  function correct() {
    try { setOutput(correctJson(input)); setError('') }
    catch (error) { setOutput(''); setError(error instanceof Error ? error.message : 'Could not repair JSON') }
  }
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ToolPanel title="Input JSON" actions={<><Button variant="ghost" size="sm" onClick={() => update("{name: 'Cuteils', tools: ['JSON', 'Time',],}")}>Example</Button><Button variant="ghost" size="sm" onClick={() => update('')} disabled={!input}>Clear</Button></>}>
        <Textarea aria-label="Input JSON" placeholder="Paste malformed JSON here..." value={input} onChange={event => update(event.target.value)} className="min-h-80 font-mono" spellCheck={false} />
        <ToolError message={error} />
        <Button onClick={correct} disabled={!input.trim()}>Correct JSON</Button>
        <p className="text-xs text-stone-500">Repairs common syntax issues. Review the output before using it.</p>
      </ToolPanel>
      <ToolPanel title="Corrected JSON" actions={<CopyButton value={output} />}><ToolOutput value={output} placeholder="Choose Correct JSON to see the repaired result." /></ToolPanel>
    </div>
  )
}
