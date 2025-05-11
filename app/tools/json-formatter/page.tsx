'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check, Home } from 'lucide-react'
import Editor from '@monaco-editor/react'

export default function JsonFormatter() {
    const [inputJson, setInputJson] = useState('')
    const [formattedJson, setFormattedJson] = useState('')
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)
    const router = useRouter()

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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(formattedJson).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <div className="h-[80vh] mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold neo-brutalism-pink px-4 py-2">JSON Formatter</h1>
                <Button variant="outline" onClick={() => router.push('/')}>
                    <Home className="h-4 w-4 mr-2" />
                    Home
                </Button>
            </div>
            <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col h-full space-y-4">
                    <Textarea
                        placeholder="Paste your JSON here..."
                        value={inputJson}
                        onChange={(e) => setInputJson(e.target.value)}
                        className="flex-grow resize-none font-mono"
                    />
                    <Button onClick={formatJson} className="w-full">
                        Format JSON
                    </Button>
                </div>
                <div className="relative h-full neo-brutalism-white">
                    {formattedJson && (
                        <>
                            <div className="absolute top-4 right-4 z-10">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                value={formattedJson}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    wrappingIndent: 'deepIndent',
                                    folding: true,
                                    foldingStrategy: 'indentation',
                                    automaticLayout: true,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </>
                    )}
                    {error && (
                        <div className="neo-brutalism bg-red-400 p-4">
                            {error}
                        </div>
                    )}
                    {!formattedJson && !error && (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Formatted JSON will appear here...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}