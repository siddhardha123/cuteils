'use client'

import { useState, useEffect } from 'react'
import ToolCard from '../components/ToolCard'
import Search from '../components/Search'
import { motion } from 'framer-motion'

const tools = [
    { title: 'JSON to CSV', description: 'Convert JSON data to CSV format', href: '/tools/json-to-csv' },
    { title: 'JSON Formatter', description: 'Format JSON data', href: '/tools/json-formatter' },
    { title: 'JSON Corrector', description: 'Correct malformed JSON data', href: '/tools/json-corrector' },
    { title: 'TOTP Generator', description: 'create totps', href: '/tools/totp-generator' },
    { title: 'JWT Parser', description: 'jwt token parse', href: '/tools/jwt-parser' },
]

export default function Home() {
    const [filteredTools, setFilteredTools] = useState(tools)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSearch = (query: string) => {
        const filtered = tools.filter(tool =>
            tool.title.toLowerCase().includes(query.toLowerCase()) ||
            tool.description.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredTools(filtered)
    }

    if (!mounted) return null

    return (
        <div className="space-y-8 p-4">
            <div className="flex justify-between items-center">
                <motion.h1
                    className="text-2xl font-semibold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Cuteils 🎀 🛠️
                </motion.h1>
                <motion.a
                    href="https://github.com/siddhardha123/cuteils"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.1}}
                >
                    <iframe
                        src="https://ghbtns.com/github-btn.html?user=siddhardha123&repo=cuteils&type=star&count=true&size=large"
                        frameBorder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
                </motion.a>
            </div>
            <motion.h1
                className="text-2xl font-bold mb-4 text-center "
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                Tiny tools ⚙️, Mighty impact 💥
            </motion.h1>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Search onSearch={handleSearch} />
            </motion.div>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                {filteredTools.map((tool, index) => (
                    <motion.div
                        key={tool.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                        <ToolCard {...tool} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}
