'use client'

import { useState, useEffect } from 'react'
import ToolCard from './components/ToolCard'
import Search from './components/Search'
import CommandMenu from './components/Command'
import { motion } from 'framer-motion'

const tools = [
    { title: 'JSON to CSV', description: 'Convert JSON data to CSV format', href: '/tools/json-to-csv' }
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
                    Cuteils
                </motion.h1>
                <motion.a
                    href="https://github.com/siddhardha123/cuteils"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    ⭐ Star Us
                </motion.a>
            </div>
            <motion.h1
                className="text-3xl font-bold mb-4 text-center "
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Tiny tools,Mighty impact
            </motion.h1>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Search onSearch={handleSearch} />
            </motion.div>
            <CommandMenu />
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
