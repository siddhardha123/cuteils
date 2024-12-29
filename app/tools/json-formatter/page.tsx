'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ArrowLeft, Copy, Check, Home } from 'lucide-react'

export default function JsonFormatter() {
    const [inputJson, setInputJson] = useState('')
    const [formattedJson, setFormattedJson] = useState('')
    const [error, setError] = useState('')
    const [textareaHeight, setTextareaHeight] = useState('12rem')
    const [copied, setCopied] = useState(false)
    const router = useRouter()

    useEffect(() => {
        adjustTextareaHeight()
    }, [inputJson])

    const adjustTextareaHeight = () => {
        const lines = inputJson.split('\n').length
        const newHeight = `${Math.max(12, Math.min(36, lines * 1.5))}rem`
        setTextareaHeight(newHeight)
    }

    const formatJson = () => {
        try {
            const parsedJson = JSON.parse(inputJson)
            const formatted = JSON.stringify(parsedJson, null, 2)
            setFormattedJson(formatted)
            setError('')
        } catch (error: any) {
            setFormattedJson('')
            setError(`Error: ${error.message}`)
        }
    }

    const handleBack = () => {
        setFormattedJson('')
        setError('')
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(formattedJson).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    const goToHomePage = () => {
        router.push('/')
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">JSON Formatter</h1>
                <Button variant="outline" onClick={goToHomePage}>
                    <Home className="h-4 w-4 mr-2" />
                    Home
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Textarea
                        placeholder="Paste your JSON here..."
                        value={inputJson}
                        onChange={(e) => setInputJson(e.target.value)}
                        className="w-full font-mono text-sm"
                        style={{ height: textareaHeight }}
                    />
                </div>
                <div className="relative">
                    {formattedJson && (
                        <>
                            <div className="absolute top-2 right-2 z-10 flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={copyToClipboard}
                                    className="bg-white"
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <SyntaxHighlighter
                                language="json"
                                style={vscDarkPlus}
                                customStyle={{
                                    height: textareaHeight,
                                    margin: 0,
                                    borderRadius: '0.375rem',
                                }}
                            >
                                {formattedJson}
                            </SyntaxHighlighter>
                        </>
                    )}
                    {error && (
                        <div className="text-red-500 bg-red-100 p-4 rounded">
                            {error}
                        </div>
                    )}
                    {!formattedJson && !error && (
                        <div
                            className="bg-gray-100 text-gray-400 p-4 rounded"
                            style={{ height: textareaHeight }}
                        >
                            Formatted JSON will appear here...
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                {formattedJson && (
                    <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                )}
                <Button onClick={formatJson} className={formattedJson ? "ml-auto" : ""}>
                    Format JSON
                </Button>
            </div>
        </div>
    )
}

