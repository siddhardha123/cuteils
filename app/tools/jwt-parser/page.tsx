'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import dynamic from 'next/dynamic'

const HomeIcon = dynamic(() => import('lucide-react').then((mod) => mod.Home), { ssr: false })
const KeyIcon = dynamic(() => import('lucide-react').then((mod) => mod.Key), { ssr: false })

interface JWTPayload {
  [key: string]: any
}

export default function JWTParser() {
    const [jwtToken, setJwtToken] = useState('')
    const [header, setHeader] = useState<JWTPayload>({})
    const [payload, setPayload] = useState<JWTPayload>({})
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        parseJWT(jwtToken)
    }, [jwtToken])

    const parseJWT = (token: string) => {
        setError('')
        setHeader({})
        setPayload({})

        if (!token) return

        try {
            const parts = token.split('.')
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format')
            }

            const decodedHeader = JSON.parse(atob(parts[0]))
            const decodedPayload = JSON.parse(atob(parts[1]))

            setHeader(decodedHeader)
            setPayload(decodedPayload)
        } catch (error) {
            console.error('Error parsing JWT:', error)
            setError('Invalid JWT token')
        }
    }

    const goToHomePage = () => {
        router.push('/')
    }

    const formatJSON = (obj: JWTPayload) => {
        return JSON.stringify(obj, null, 2)
    }

    return (
        <div className="min-h-screen flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">JWT Parser</h1>
                <Button variant="outline" onClick={goToHomePage}>
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Home
                </Button>
            </div>
            <div className="mb-4">
                <Label htmlFor="jwtToken">JWT Token</Label>
                <Textarea
                    id="jwtToken"
                    placeholder="Enter JWT token..."
                    value={jwtToken}
                    onChange={(e) => setJwtToken(e.target.value)}
                    rows={3}
                    className="w-full"
                />
                {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-250px)]">
                <Card className="flex flex-col">
                    <CardContent className="flex-grow overflow-hidden p-4">
                        <h2 className="text-xl font-bold mb-2 flex items-center">
                            <KeyIcon className="h-5 w-5 mr-2" />
                            Header
                        </h2>
                        <SyntaxHighlighter
                                language="json"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    borderRadius: '0.375rem',
                                }}
                            >
                                  {formatJSON(header)}
                            </SyntaxHighlighter>
                    </CardContent>
                </Card>
                <Card className="flex flex-col">
                    <CardContent className="flex-grow overflow-hidden p-4">
                        <h2 className="text-xl font-bold mb-2 flex items-center">
                            <KeyIcon className="h-5 w-5 mr-2" />
                            Payload
                        </h2>
                        <SyntaxHighlighter
                                language="json"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    borderRadius: '0.375rem',
                                }}
                            >
                                  {formatJSON(payload)}
                            </SyntaxHighlighter>
    
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

