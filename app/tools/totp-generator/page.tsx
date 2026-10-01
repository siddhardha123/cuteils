'use client'

import { useState, useEffect } from 'react'
import * as OTPAuth from 'otpauth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton, ToolError, ToolPanel } from '@/components/ToolWorkspace'

export default function TOTPGenerator() {
  const [secret, setSecret] = useState('')
  const [digits, setDigits] = useState('6')
  const [period, setPeriod] = useState('30')
  const [code, setCode] = useState('')
  const [remaining, setRemaining] = useState(0)
  const [error, setError] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  useEffect(() => {
    function generate() {
      if (!secret.trim()) { setCode(''); setError(''); setRemaining(0); return }
      try {
        const seconds = Number(period), count = Number(digits)
        if (!Number.isInteger(seconds) || seconds < 30 || seconds > 300) throw new Error('Period must be a whole number between 30 and 300 seconds.')
        if (!Number.isInteger(count) || count < 6 || count > 8) throw new Error('Choose 6, 7, or 8 digits.')
        const cleaned = secret.replace(/\s/g, '').toUpperCase()
        if (!/^[A-Z2-7]+=*$/.test(cleaned)) throw new Error('Enter a valid Base32 secret key.')
        const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(cleaned), digits: count, period: seconds, algorithm: 'SHA1' })
        setCode(totp.generate())
        setRemaining(seconds - Math.floor(Date.now() / 1000) % seconds)
        setError('')
      } catch (cause) { setCode(''); setRemaining(0); setError(cause instanceof Error ? cause.message : 'Invalid secret or configuration.') }
    }
    generate()
    const interval = setInterval(generate, 1000)
    return () => clearInterval(interval)
  }, [secret, digits, period])
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ToolPanel title="Secret and settings" actions={<Button variant="ghost" size="sm" onClick={() => setSecret('')} disabled={!secret}>Clear</Button>}>
        <div className="space-y-2">
          <Label htmlFor="secret">Secret key (Base32)</Label>
          <Input id="secret" type={showSecret ? 'text' : 'password'} value={secret} onChange={event => setSecret(event.target.value)} placeholder="Enter your Base32 secret..." autoComplete="off" spellCheck={false} />
          <Button variant="ghost" size="sm" aria-pressed={showSecret} onClick={() => setShowSecret(!showSecret)}>{showSecret ? 'Hide secret' : 'Show secret'}</Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="digits">Digits</Label><select id="digits" value={digits} onChange={event => setDigits(event.target.value)} className="h-11 w-full border-2 border-black bg-white px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">{['6', '7', '8'].map(value => <option key={value}>{value}</option>)}</select></div>
          <div className="space-y-2"><Label htmlFor="period">Period (seconds)</Label><Input id="period" type="number" min={30} max={300} value={period} onChange={event => setPeriod(event.target.value)} /></div>
        </div>
        <ToolError message={error} />
        <p className="text-xs text-stone-500">Uses SHA-1. The secret stays in this page and is not saved.</p>
      </ToolPanel>
      <ToolPanel title="One-time code" actions={<CopyButton value={code} />}>
        <div className="flex min-h-64 flex-col items-center justify-center gap-5 bg-stone-50 p-4 text-center">
          <p className="font-mono text-4xl font-bold tracking-wider sm:text-5xl">{code || '------'}</p>
          <p className="text-sm text-stone-500">{code ? `Refreshes in ${remaining} seconds` : 'Enter a secret to generate a code.'}</p>
          {code && <progress value={remaining} max={Number(period)} aria-label="Seconds until code refresh" className="h-2 w-full max-w-60 accent-pink-500" />}
        </div>
      </ToolPanel>
    </div>
  )
}
