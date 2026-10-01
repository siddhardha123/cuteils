'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

export function ToolSelect({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (value: string) => void; options: readonly { value: string; label: string }[] }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select id={id} value={value} onChange={event => onChange(event.target.value)} className="h-11 w-full min-w-0 border-2 border-black bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  )
}

export function DownloadButton({ value, filename, mimeType }: { value: string; filename: string; mimeType: string }) {
  function download() {
    const url = URL.createObjectURL(new Blob([value], { type: mimeType }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <Button variant="ghost" size="sm" disabled={!value} onClick={download}><Download />Download</Button>
}

export function ToolPanel({ title, actions, children, className }: { title: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section aria-label={title} className={cn('min-w-0 border-4 border-black bg-white shadow-[4px_4px_0_0_#000]', className)}>
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b-2 border-black px-4 py-3 sm:px-5">
        <h2 className="text-lg font-bold">{title}</h2>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className="space-y-4 p-4 sm:p-5">{children}</div>
    </section>
  )
}

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    setCopied(false)
    setError('')
    if (timer.current) clearTimeout(timer.current)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [value])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setError('')
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Copy failed. Select the result and copy it manually.')
    }
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" size="sm" onClick={copy} disabled={!value} aria-label={copied ? 'Copied result' : 'Copy result'}>
        {copied ? <Check /> : <Copy />}{copied ? 'Copied' : 'Copy'}
      </Button>
      <span className="sr-only" role="status">{copied ? 'Result copied to clipboard.' : ''}</span>
      {error && <p role="alert" className="max-w-60 text-xs text-red-700">{error}</p>}
    </div>
  )
}

export function ToolOutput({ value, placeholder = 'Your result will appear here.' }: { value: string; placeholder?: string }) {
  return value ? (
    <pre className="min-h-64 max-h-[36rem] overflow-auto whitespace-pre-wrap break-words bg-stone-50 p-4 font-mono text-sm leading-6">{value}</pre>
  ) : (
    <div className="flex min-h-64 items-center justify-center border-2 border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">{placeholder}</div>
  )
}

export function ToolError({ message }: { message: string }) {
  return message ? <p role="alert" className="border-2 border-red-700 bg-red-50 p-3 text-sm text-red-800">{message}</p> : null
}
