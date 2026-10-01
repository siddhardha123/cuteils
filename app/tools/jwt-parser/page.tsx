'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'
import { decodeJwt } from '@/lib/tool-utils'

const example = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJuYW1lIjoiQ3V0ZWlscyIsInN1YiI6ImRlbW8ifQ.'

export default function JWTParser() {
  const [input, setInput] = useState('')
  let header = '', payload = '', error = ''
  if (input.trim()) {
    try { const decoded = decodeJwt(input.trim()); header = JSON.stringify(decoded.header, null, 2); payload = JSON.stringify(decoded.payload, null, 2) }
    catch (cause) { error = cause instanceof Error ? cause.message : 'Invalid JWT' }
  }
  return (
    <div className="space-y-6">
      <ToolPanel title="JWT token" actions={<><Button variant="ghost" size="sm" onClick={() => setInput(example)}>Example</Button><Button variant="ghost" size="sm" disabled={!input} onClick={() => setInput('')}>Clear</Button></>}>
        <Textarea aria-label="JWT token" placeholder="Paste a JWT token to decode it automatically..." value={input} onChange={event => setInput(event.target.value)} className="min-h-32 font-mono" spellCheck={false} autoComplete="off" />
        <ToolError message={error} />
        <p className="text-sm text-stone-600">Decoding only: the signature and authenticity of this token are not verified.</p>
      </ToolPanel>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ToolPanel title="Header" actions={<CopyButton value={header} />}><ToolOutput value={header} placeholder="The decoded token header will appear here." /></ToolPanel>
        <ToolPanel title="Payload" actions={<CopyButton value={payload} />}><ToolOutput value={payload} placeholder="The decoded token payload will appear here." /></ToolPanel>
      </div>
    </div>
  )
}
