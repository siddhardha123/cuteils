'use client'

import {useEffect, useState} from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import {Check, Copy, Home} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function JsonCorrector() {
    const [inputJson, setInputJson] = useState('')
    const [outputJson, setOutputJson] = useState('')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')
    const [textareaHeight, setTextareaHeight] = useState('12rem')
    const router = useRouter()

    const adjustTextareaHeight = () => {
        const lines = inputJson.split('\n').length
        const newHeight = `${Math.max(12, Math.min(36, lines * 1.5))}rem`
        setTextareaHeight(newHeight)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(outputJson).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }


    useEffect(() => {
        adjustTextareaHeight()
    }, [inputJson])

    const correctJson = () => {
        try {
            // First, try to parse the JSON as-is
            const parsedJson = JSON.parse(inputJson)
            setOutputJson(JSON.stringify(parsedJson, null, 2))
        } catch (error) {
            // If parsing fails, attempt to correct common issues
            let correctedJson = inputJson
                // Replace single quotes with double quotes
                .replace(/'/g, '"')
                // Add quotes to unquoted keys
                .replace(/(\w+):/g, '"$1":')
                // Remove trailing commas
                .replace(/,\s*([\]}])/g, '$1')

            try {
                // Try to parse the corrected JSON
                const parsedJson = JSON.parse(correctedJson)
                setOutputJson(JSON.stringify(parsedJson, null, 2))
            } catch (secondError : any) {
                // If it still fails, show an error message
                setError(secondError.message)
            }
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">JSON Corrector (Beta)</h1>
                <Button variant="outline" onClick={() => router.push('/')}>
                    <Home className="h-4 w-4 mr-2"/>
                    Home
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Textarea
                        placeholder="Paste your potentially malformed JSON here..."
                        value={inputJson}
                        onChange={(e) => setInputJson(e.target.value)}
                        style={{ height: textareaHeight }}
                    />
                </div>
                <div className="relative">
                    {outputJson && (
                        <>
                            <div className="absolute top-2 right-2 z-10 flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
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
                                {outputJson}
                            </SyntaxHighlighter>
                        </>
                    )}
                    {error && (
                        <div className="text-red-500 bg-red-100 p-4 rounded">
                            {error}
                        </div>
                    )}
                    {!outputJson && !error && (
                        <div
                            className="bg-gray-100 text-gray-400 p-4 rounded"
                            style={{height: textareaHeight}}
                        >
                            Formatted JSON will appear here...
                        </div>
                    )}
                </div>
            </div>
            <Button onClick={correctJson} className="mt-4">
                Correct JSON
            </Button>
        </div>
    )
}

