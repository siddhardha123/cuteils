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

    const goToHomePage = () => {
        router.push('/')
    }

    return (
        <div className="h-[80vh] mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">JSON Formatter</h1>
                <Button variant="outline" onClick={goToHomePage}>
                    <Home className="h-4 w-4 mr-2" />
                    Home
                </Button>
            </div>
            <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                <div className="flex flex-col h-full">
                    <Textarea
                        placeholder="Paste your JSON here..."
                        value={inputJson}
                        onChange={(e) => setInputJson(e.target.value)}
                        className="w-full font-mono text-sm flex-grow resize-none"
                    />
                    <Button onClick={formatJson} className="mt-4">
                        Format JSON
                    </Button>
                </div>
                <div className="relative h-full">
                    {formattedJson && (
                        <>
                            <div className="absolute top-2 right-2 z-10 flex space-x-2">
                                <Button
                                    variant="outline"
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
                        <div className="text-red-500 bg-red-100 p-4 rounded">
                            {error}
                        </div>
                    )}
                    {!formattedJson && !error && (
                        <div className="bg-gray-100 text-gray-400 p-4 rounded h-full">
                            Formatted JSON will appear here...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

