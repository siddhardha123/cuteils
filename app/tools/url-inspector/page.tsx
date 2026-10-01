'use client'

import { useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'
import { inspectUrl, rebuildUrl, transformUrlComponent } from '@/lib/url-utils'

const example = 'https://example.com/search?q=cute+tools&tag=json&tag=time#results'
type Parameter = { id: number; key: string; value: string }

export default function UrlInspector() {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<ReturnType<typeof inspectUrl> | null>(null)
  const [parameters, setParameters] = useState<Parameter[]>([])
  const [error, setError] = useState('')
  const nextId = useRef(0)
  const [component, setComponent] = useState('')
  const [componentOutput, setComponentOutput] = useState('')
  const [componentError, setComponentError] = useState('')
  const rebuilt = parsed ? rebuildUrl(parsed.href, parameters) : ''

  function update(value: string) {
    setInput(value); setParsed(null); setParameters([]); setError('')
  }
  function inspect() {
    try {
      const result = inspectUrl(input)
      setParsed(result)
      nextId.current = result.parameters.length
      setParameters(result.parameters.map((parameter, id) => ({ ...parameter, id })))
      setError('')
    } catch (cause) {
      setParsed(null)
      setError(cause instanceof Error ? cause.message : 'Invalid URL.')
    }
  }
  function edit(id: number, field: 'key' | 'value', value: string) {
    setParameters(parameters.map(parameter => parameter.id === id ? { ...parameter, [field]: value } : parameter))
  }
  function updateComponent(value: string) {
    setComponent(value); setComponentOutput(''); setComponentError('')
  }
  function transform(mode: 'encode' | 'decode') {
    try { setComponentOutput(transformUrlComponent(component, mode)); setComponentError('') }
    catch (cause) { setComponentOutput(''); setComponentError(cause instanceof Error ? cause.message : 'Invalid component.') }
  }

  return (
    <div className="space-y-6">
      <ToolPanel title="URL" actions={<>
        <Button variant="ghost" size="sm" onClick={() => update(example)}>Example</Button>
        <Button variant="ghost" size="sm" disabled={!input} onClick={() => update('')}>Clear</Button>
      </>}>
        <Label htmlFor="url-input">Complete URL</Label>
        <Input id="url-input" type="url" value={input} onChange={event => update(event.target.value)} placeholder="https://example.com/path?name=value" autoComplete="off" spellCheck={false} />
        <ToolError message={error} />
        <Button onClick={inspect} disabled={!input.trim()}>Inspect URL</Button>
      </ToolPanel>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ToolPanel title="Query parameters" actions={<Button variant="ghost" size="sm" disabled={!parsed} onClick={() => setParameters([...parameters, { id: nextId.current++, key: '', value: '' }])}><Plus />Add</Button>}>
          {parsed ? <>
            {parameters.length ? parameters.map((parameter, index) => (
              <div key={parameter.id} className="flex items-start gap-2">
                <div className="min-w-0 flex-1 space-y-2">
                  <Input aria-label={`Parameter ${index + 1} name`} placeholder="Name" value={parameter.key} onChange={event => edit(parameter.id, 'key', event.target.value)} />
                  <Input aria-label={`Parameter ${index + 1} value`} placeholder="Value" value={parameter.value} onChange={event => edit(parameter.id, 'value', event.target.value)} />
                </div>
                <Button variant="ghost" size="icon" aria-label={`Remove parameter ${index + 1}`} onClick={() => setParameters(parameters.filter(item => item.id !== parameter.id))}><Trash2 /></Button>
              </div>
            )) : <p className="py-6 text-sm text-stone-500">No query parameters. Add one to build your URL.</p>}
            <p className="text-xs text-stone-500">Duplicate names are preserved. Spaces in the rebuilt query use + encoding.</p>
          </> : <ToolOutput value="" placeholder="Inspect a URL to edit its query parameters." />}
        </ToolPanel>
        <ToolPanel title="Rebuilt URL" actions={<CopyButton value={rebuilt} />}>
          <ToolOutput value={rebuilt} placeholder="Your edited URL will appear here." />
          {parsed && <dl className="space-y-2 text-sm">
            {Object.entries({ Protocol: parsed.protocol, Host: parsed.hostname, Port: parsed.port, Path: parsed.pathname, Fragment: parsed.hash || '(none)' }).map(([key, value]) => <div key={key} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2"><dt className="text-stone-500">{key}</dt><dd className="break-words font-mono">{value}</dd></div>)}
          </dl>}
        </ToolPanel>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ToolPanel title="URL component codec" actions={<Button variant="ghost" size="sm" disabled={!component} onClick={() => updateComponent('')}>Clear component</Button>}>
          <Textarea aria-label="URL component" value={component} onChange={event => updateComponent(event.target.value)} placeholder="Text or a percent-encoded URL component..." className="min-h-40 font-mono" spellCheck={false} />
          <div className="flex flex-wrap gap-3"><Button disabled={!component} onClick={() => transform('encode')}>Encode component</Button><Button variant="outline" disabled={!component} onClick={() => transform('decode')}>Decode component</Button></div>
          <ToolError message={componentError} />
          <p className="text-xs text-stone-500">Encodes one component, such as a query value. Decoding keeps literal + characters unchanged.</p>
        </ToolPanel>
        <ToolPanel title="Component result" actions={<CopyButton value={componentOutput} />}><ToolOutput value={componentOutput} placeholder="Encode or decode a component to see its result." /></ToolPanel>
      </div>
    </div>
  )
}
