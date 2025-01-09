'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import * as OTPAuth from 'otpauth'

const HomeIcon = dynamic(() => import('lucide-react').then((mod) => mod.Home), { ssr: false })
const RefreshCwIcon = dynamic(() => import('lucide-react').then((mod) => mod.RefreshCw), { ssr: false })

export default function TOTPTool() {
    const [secretKey, setSecretKey] = useState('')
    const [digits, setDigits] = useState('6')
    const [period, setPeriod] = useState('30')
    const [totpCode, setTotpCode] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [error, setError] = useState('')
    const router = useRouter()

    function stripSpaces(str: string) {
        return str.replace(/\s/g, '')
    }

    useEffect(() => {
        const generateTOTP = () => {
            if (secretKey) {
                try {
                    const cleanedSecret = stripSpaces(secretKey)
                    
                    // Validate Base32 format before proceeding
                    if (!/^[A-Z2-7]+=*$/.test(cleanedSecret)) {
                        throw new Error('Secret key is not in valid Base32 format.')
                    }

                    const totp = new OTPAuth.TOTP({
                        secret: OTPAuth.Secret.fromBase32(cleanedSecret),
                        digits: parseInt(digits),
                        period: parseInt(period),
                        algorithm: 'SHA1'
                    })
                    setTotpCode(totp.generate())
                    setError('')
                } catch (error) {
                    console.error('Error generating TOTP:', error)
                    setTotpCode('')
                    setError('Invalid secret key or configuration')
                }
            } else {
                setTotpCode('')
                setError('')
            }
        }

        const updateRemainingTime = () => {
            const timeLeft = parseInt(period) - Math.floor(Date.now() / 1000) % parseInt(period)
            setTimeRemaining(timeLeft)
        }

        generateTOTP()
        updateRemainingTime()

        const interval = setInterval(() => {
            generateTOTP()
            updateRemainingTime()
        }, 1000)

        return () => clearInterval(interval)
    }, [secretKey, digits, period])

    const goToHomePage = () => {
        router.push('/')
    }

    const handleDigitsChange = (value: string) => {
        const num = parseInt(value)
        if (num >= 6 && num <= 8) {
            setDigits(value)
        }
    }

    const handlePeriodChange = (value: string) => {
        const num = parseInt(value)
        if (num >= 30 && num <= 300) {
            setPeriod(value)
        }
    }

    return (
        <div className="h-[80vh] mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">TOTP Generator</h1>
                <Button variant="outline" onClick={goToHomePage}>
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Home
                </Button>
            </div>
            <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                    <div>
                        <Label htmlFor="secretKey">Secret Key (Base32)</Label>
                        <Input
                            id="secretKey"
                            placeholder="Enter secret key..."
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div>
                        <Label htmlFor="digits">Number of Digits</Label>
                        <Input
                            id="digits"
                            type="number"
                            min="6"
                            max="8"
                            value={digits}
                            onChange={(e) => handleDigitsChange(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="period">Token Period (seconds)</Label>
                        <Input
                            id="period"
                            type="number"
                            min="30"
                            max="300"
                            step="30"
                            value={period}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                        />
                    </div>
                </div>
                <Card className="flex items-center justify-center">
                    <CardContent className="text-center">
                        <h2 className="text-2xl font-bold mb-4">TOTP Code</h2>
                        {error ? (
                            <div className="text-red-500 mb-4">{error}</div>
                        ) : (
                            <>
                                <div className="text-4xl font-mono mb-4">{totpCode || '------'}</div>
                                <div className="flex items-center justify-center">
                                    <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                                    <span>Refreshes in {timeRemaining} seconds</span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

