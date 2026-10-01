'use client'

import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton, ToolError, ToolOutput, ToolPanel, ToolSelect } from '@/components/ToolWorkspace'
import { decodeBase64, encodeBase64, type Base64Alphabet } from '@/lib/base64-utils'

export default function Base64Codec() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('encode')
  const [alphabet, setAlphabet] = useState<Base64Alphabet>('base64')
  function resetResult() { setOutput(''); setError('') }
  function update(value: string) { setInput(value); resetResult() }
  function convert() {
    try { setOutput(mode === 'encode' ? encodeBase64(input, alphabet) : decodeBase64(input, alphabet)); setError('') }
    catch (cause) { setOutput(''); setError(cause instanceof Error ? cause.message : 'Could not convert this text.') }
  }
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ToolPanel title="Input text" actions={<>
        <Button variant="ghost" size="sm" onClick={() => update(mode === 'encode' ? 'Hello, Cuteils! 🎀' : encodeBase64('Hello, Cuteils! 🎀', alphabet))}>Example</Button>
        <Button variant="ghost" size="sm" disabled={!input} onClick={() => update('')}>Clear</Button>
      </>}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ToolSelect id="codec-direction" label="Direction" value={mode} onChange={value => { setMode(value); resetResult() }} options={[{ value: 'encode', label: 'Text → Base64' }, { value: 'decode', label: 'Base64 → Text' }]} />
          <ToolSelect id="codec-alphabet" label="Alphabet" value={alphabet} onChange={value => { setAlphabet(value as Base64Alphabet); resetResult() }} options={[{ value: 'base64', label: 'Base64 (+ / =)' }, { value: 'base64url', label: 'Base64URL (- _, unpadded)' }]} />
        </div>
        <Textarea aria-label="Input text" value={input} onChange={event => update(event.target.value)} placeholder={mode === 'encode' ? 'Paste UTF-8 text to encode...' : 'Paste encoded text to decode...'} className="min-h-64 font-mono" spellCheck={false} />
        <ToolError message={error} />
        <Button onClick={convert} disabled={!input}>{mode === 'encode' ? 'Encode text' : 'Decode text'}</Button>
        <p className="text-xs text-stone-500">Supports Unicode and emoji. When decoding, whitespace is ignored and padding is optional.</p>
      </ToolPanel>
      <ToolPanel title="Result" actions={<CopyButton value={output} />}>
        <ToolOutput value={output} placeholder="Choose Encode text or Decode text to see the result." />
        <Button variant="outline" disabled={!output} onClick={() => { update(output); setMode(mode === 'encode' ? 'decode' : 'encode') }}><ArrowRightLeft />Use result as input</Button>
      </ToolPanel>
    </div>
  )
}
