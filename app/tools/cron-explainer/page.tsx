'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton, ToolError, ToolOutput, ToolPanel, ToolSelect } from '@/components/ToolWorkspace'
import { explainCron } from '@/lib/cron-utils'

const timezones = ['Asia/Kolkata', 'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney']

export default function CronExplainer() {
  const [input, setInput] = useState('')
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [start, setStart] = useState('')
  const [result, setResult] = useState<ReturnType<typeof explainCron> | null>(null)
  const [error, setError] = useState('')
  function resetResult() { setResult(null); setError('') }
  function update(value: string) { setInput(value); resetResult() }
  function explain() {
    try {
      const from = start ? new Date(`${start}Z`) : new Date()
      setResult(explainCron(input, timezone, from)); setError('')
    } catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : 'Invalid cron schedule.') }
  }
  const format = (iso: string) => new Intl.DateTimeFormat('en-GB', { timeZone: timezone, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' }).format(new Date(iso))
  const output = result ? `${result.description} (${timezone})\n\nNext five runs:\n${result.dates.map(iso => `${format(iso)}\nUTC: ${iso}`).join('\n\n')}` : ''
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ToolPanel title="Cron schedule" actions={<>
        <Button variant="ghost" size="sm" onClick={() => update('0 9 * * 1-5')}>Example</Button>
        <Button variant="ghost" size="sm" disabled={!input} onClick={() => update('')}>Clear</Button>
      </>}>
        <div className="space-y-2"><Label htmlFor="cron-expression">Expression</Label><Input id="cron-expression" value={input} onChange={event => update(event.target.value)} placeholder="e.g. */15 * * * *" className="font-mono" spellCheck={false} /></div>
        <p className="font-mono text-xs text-stone-500">minute · hour · day · month · weekday</p>
        <ToolSelect id="cron-timezone" label="Schedule timezone" value={timezone} onChange={value => { setTimezone(value); resetResult() }} options={timezones.map(value => ({ value, label: value }))} />
        <div className="space-y-2"><Label htmlFor="cron-start">Start time (UTC, optional)</Label><Input id="cron-start" type="datetime-local" value={start} onChange={event => { setStart(event.target.value); resetResult() }} /><p className="text-xs text-stone-500">Leave blank to preview from now. All listed runs occur after this time.</p></div>
        <ToolError message={error} />
        <Button onClick={explain} disabled={!input.trim()}>Explain schedule</Button>
        <p className="text-xs text-stone-500">Accepts five fields, six with seconds first, and aliases like @daily. This previews a schedule; it does not run jobs.</p>
      </ToolPanel>
      <ToolPanel title="Explanation and next runs" actions={<CopyButton value={output} />}>
        <ToolOutput value={output} placeholder="Explain a schedule to see its next five runs." />
      </ToolPanel>
    </div>
  )
}
