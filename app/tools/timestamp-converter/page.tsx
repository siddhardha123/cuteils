'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'

const timezones = ['UTC', 'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney']
const selectClass = 'h-11 w-full border-2 border-black bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'

export default function TimestampConverter() {
  const [input, setInput] = useState('')
  const [unit, setUnit] = useState('seconds')
  const [timezone, setTimezone] = useState('UTC')
  let output = '', error = ''
  if (input.trim()) {
    try {
      const value = Number(input)
      if (!Number.isFinite(value)) throw new Error('Invalid timestamp')
      const date = new Date(value * (unit === 'seconds' ? 1000 : 1))
      if (Number.isNaN(date.getTime())) throw new Error('Timestamp is outside the supported date range')
      output = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' }).format(date)
      output += `\n\nISO (UTC): ${date.toISOString()}`
    } catch (cause) { error = cause instanceof Error ? cause.message : 'Invalid timestamp' }
  }
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ToolPanel title="Unix timestamp" actions={<><Button variant="ghost" size="sm" onClick={() => setInput(String(unit === 'seconds' ? Math.floor(Date.now() / 1000) : Date.now()))}>Now</Button><Button variant="ghost" size="sm" onClick={() => setInput('')} disabled={!input}>Clear</Button></>}>
        <div className="space-y-2"><Label htmlFor="timestamp">Timestamp</Label><Input id="timestamp" type="number" value={input} onChange={event => setInput(event.target.value)} placeholder="e.g. 1735689600" /></div>
        <div className="space-y-2"><Label htmlFor="timestamp-unit">Unit</Label><select id="timestamp-unit" value={unit} onChange={event => setUnit(event.target.value)} className={selectClass}><option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option></select></div>
        <div className="space-y-2"><Label htmlFor="timezone">Timezone</Label><select id="timezone" value={timezone} onChange={event => setTimezone(event.target.value)} className={selectClass}>{timezones.map(zone => <option key={zone} value={zone}>{zone}</option>)}</select></div>
        <ToolError message={error} />
      </ToolPanel>
      <ToolPanel title="Date and time" actions={<CopyButton value={output} />}><ToolOutput value={output} placeholder="Enter a timestamp to convert it automatically." /></ToolPanel>
    </div>
  )
}
