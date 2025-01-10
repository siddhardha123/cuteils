'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ArrowRightLeft } from 'lucide-react'

const timeUnits = [
  { value: 'milliseconds', label: 'Milliseconds' },
  { value: 'seconds', label: 'Seconds' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
]

const conversionFactors: { [key: string]: number } = {
  milliseconds: 0.001,
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2629746,  // Average month (365.2425 days / 12)
  years: 31556952,  // Average year (365.2425 days)
}

export default function TimeUnitConverter() {
  const [inputValue, setInputValue] = useState<string>('1')
  const [inputUnit, setInputUnit] = useState<string>('hours')
  const [outputUnit, setOutputUnit] = useState<string>('minutes')
  const [result, setResult] = useState<string>('')

  useEffect(() => {
    convertTime()
  }, [inputValue, inputUnit, outputUnit])

  const convertTime = () => {
    const input = parseFloat(inputValue)
    if (isNaN(input)) {
      setResult('Invalid input')
      return
    }

    const secondsValue = input * conversionFactors[inputUnit]
    const outputValue = secondsValue / conversionFactors[outputUnit]
    
    // Adjust precision based on the output unit
    const precision = outputUnit === 'milliseconds' ? 3 : 6
    setResult(outputValue.toFixed(precision))
  }

  const handleSwapUnits = () => {
    setInputUnit(outputUnit)
    setOutputUnit(inputUnit)
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            <Clock className="mr-2" />
            Time Unit Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="input-value">Input Value</Label>
              <Input
                id="input-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-unit">From</Label>
              <Select value={inputUnit} onValueChange={setInputUnit}>
                <SelectTrigger id="input-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {timeUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-start-2">
              <Label htmlFor="output-unit">To</Label>
              <Select value={outputUnit} onValueChange={setOutputUnit}>
                <SelectTrigger id="output-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {timeUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-center my-4">
            <button
              onClick={handleSwapUnits}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Swap units"
            >
              <ArrowRightLeft className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Result:</h3>
                <p className="text-2xl font-mono">
                  {inputValue} {inputUnit} = {result} {outputUnit}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

