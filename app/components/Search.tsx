'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface SearchProps {
    onSearch: (query: string) => void
}

export default function Search({ onSearch }: SearchProps) {
    const [query, setQuery] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <motion.div
                className="relative shadow-lg rounded-lg bg-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tools..."
                    className="w-full p-4 pr-16 text-gray-700 border-none rounded-lg shadow-inner outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 placeholder-gray-500"
                />
                <button
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-transform duration-300 hover:scale-110 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </motion.div>
        </form>
    )
}
