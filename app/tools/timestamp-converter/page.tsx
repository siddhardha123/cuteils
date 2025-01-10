'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from 'lucide-react'

const timezones = [
  'UTC',
  'GMT',
  'Asia/Kolkata', // IST
  'America/New_York', // EST/EDT
  'America/Los_Angeles', // PST/PDT
  'Europe/Paris', // CET/CEST
]

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>('')
  const [timezone, setTimezone] = useState<string>('UTC')
  const [convertedTime, setConvertedTime] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    convertTimestamp()
  }, [timestamp, timezone])

  const convertTimestamp = () => {
    if (!timestamp) {
      setConvertedTime('')
      setError('')
      return
    }

    const timestampNumber = Number(timestamp)
    if (isNaN(timestampNumber)) {
      setError('Invalid timestamp')
      setConvertedTime('')
      return
    }

    try {
      const date = new Date(timestampNumber * 1000) // Convert to milliseconds
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
      setConvertedTime(formattedDate)
      setError('')
    } catch (err) {
      setError('Error converting timestamp')
      setConvertedTime('')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            <Clock className="mr-2" />
            Timestamp to Time Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="timestamp">Unix Timestamp</Label>
              <Input
                id="timestamp"
                type="number"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="Enter Unix timestamp"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Converted Time:</h3>
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <p className="text-2xl font-mono">{convertedTime || 'Enter a timestamp'}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

