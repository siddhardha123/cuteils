'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import {Home} from "lucide-react";

export default function JsonToCsv() {
    const [json, setJson] = useState('')
    const [csv, setCsv] = useState('')
    const router = useRouter()

    const convertJsonToCsv = () => {
        // @ts-ignore
        try {
            const jsonData = JSON.parse(json)
            if (!Array.isArray(jsonData)) {
                throw new Error('Input must be an array of objects')
            }

            const headers = Object.keys(jsonData[0])
            const csvRows = [
                headers.join(','),
                ...jsonData.map(row =>
                    headers.map(fieldName => JSON.stringify(row[fieldName])).join(',')
                )
            ]

            setCsv(csvRows.join('\n'))
        } catch (error : any) {
            setCsv(`Error: ${error.message}`)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4" >
                <h1 className="text-2xl font-bold mb-4">JSON to CSV Converter</h1>
                <Button variant="outline" onClick={() => router.push('/')}>
                    <Home className="h-4 w-4 mr-2"/>
                    Home
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Textarea
                        placeholder="Paste your JSON here..."
                        value={json}
                        onChange={(e) => setJson(e.target.value)}
                        className="h-64"
                    />
                </div>
                <div>
                    <Textarea
                        placeholder="CSV output will appear here..."
                        value={csv}
                        readOnly
                        className="h-64"
                    />
                </div>
            </div>
            <Button onClick={convertJsonToCsv} className="mt-4">
                Convert to CSV
            </Button>
        </div>
    )
}

