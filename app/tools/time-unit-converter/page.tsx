'use client'

import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton, ToolError, ToolOutput, ToolPanel } from '@/components/ToolWorkspace'

const units = { milliseconds: 0.001, seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 604800, months: 2629746, years: 31556952 }
type Unit = keyof typeof units
const selectClass = 'h-11 w-full border-2 border-black bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'

export default function TimeUnitConverter() {
  const [input, setInput] = useState('1')
  const [from, setFrom] = useState<Unit>('hours')
  const [to, setTo] = useState<Unit>('minutes')
  const number = Number(input)
  const value = number * units[from] / units[to]
  const error = input.trim() && (!Number.isFinite(number) || !Number.isFinite(value)) ? 'Enter a finite number.' : ''
  const result = input.trim() && !error ? `${input} ${from} = ${Number(value.toPrecision(12))} ${to}` : ''
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ToolPanel title="Duration" actions={<Button variant="ghost" size="sm" disabled={!input} onClick={() => setInput('')}>Clear</Button>}>
        <div className="space-y-2"><Label htmlFor="duration-value">Value</Label><Input id="duration-value" type="number" value={input} onChange={event => setInput(event.target.value)} placeholder="Enter a duration" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="from-unit">From</Label><select id="from-unit" className={selectClass} value={from} onChange={event => setFrom(event.target.value as Unit)}>{Object.keys(units).map(unit => <option key={unit} value={unit}>{unit[0].toUpperCase() + unit.slice(1)}</option>)}</select></div>
          <div className="space-y-2"><Label htmlFor="to-unit">To</Label><select id="to-unit" className={selectClass} value={to} onChange={event => setTo(event.target.value as Unit)}>{Object.keys(units).map(unit => <option key={unit} value={unit}>{unit[0].toUpperCase() + unit.slice(1)}</option>)}</select></div>
        </div>
        <ToolError message={error} />
        <Button variant="outline" onClick={() => { setFrom(to); setTo(from) }}><ArrowRightLeft />Swap units</Button>
        <p className="text-xs text-stone-500">Months and years use averages based on a 365.2425-day year.</p>
      </ToolPanel>
      <ToolPanel title="Converted duration" actions={<CopyButton value={result} />}><ToolOutput value={result} placeholder="Enter a value to convert it automatically." /></ToolPanel>
    </div>
  )
}
