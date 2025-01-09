'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ToolCard from '../components/ToolCard'
import Search from '../components/Search'
import { Github, Star, Code, Zap, Lock, Coffee } from 'lucide-react'
import { Button } from "@/components/ui/button"

const tools = [
    { title: 'JSON to CSV', description: 'Convert JSON data to CSV format', href: '/tools/json-to-csv' },
    { title: 'JSON Formatter', description: 'Format JSON data', href: '/tools/json-formatter' },
    { title: 'JSON Corrector', description: 'Correct malformed JSON data', href: '/tools/json-corrector' },
    { title: 'TOTP Generator', description: 'Create Time-Based One-Time Passwords', href: '/tools/totp-generator' },
    { title: 'JWT Parser', description: 'Parse and verify JWT tokens', href: '/tools/jwt-parser' },
    { title: 'JSON Diff', description: 'Find the difference between two JSON objects', href: '/tools/json-diff' },
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
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <motion.h1
                    className="text-3xl font-bold text-pink-600"
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
            </header>

            <main className="container mx-auto px-4 py-12 space-y-24">
                {/* Hero Section */}
                <section className="text-center space-y-8">
                    <motion.h2
                        className="text-5xl font-extrabold text-gray-900"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                    >
                        Tiny tools ⚙️, Mighty impact 💥
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                    >
                        Cuteils is your go-to toolkit for everyday developer tasks. Open-source, free, and always at your fingertips.
                    </motion.p>
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.4}}
                    >
                        <Button size="lg" asChild>
                            <a href="#tools">Explore Tools</a>
                        </Button>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: <Code size={48} />, title: "Open Source", description: "Fully transparent and community-driven. Contribute and make it better!" },
                        { icon: <Zap size={48} />, title: "Lightning Fast", description: "Optimized for speed. Get your tasks done in seconds, not minutes." },
                        { icon: <Lock size={48} />, title: "Secure & Private", description: "Your data never leaves your browser. We respect your privacy." },
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="text-center space-y-4"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.1 * index}}
                        >
                            <div className="text-pink-500 flex justify-center">{feature.icon}</div>
                            <h3 className="text-2xl font-semibold text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Tools Section */}
                <section id="tools" className="space-y-12">
                    <h2 className="text-3xl font-bold text-center text-pink-500">Our Tools</h2>
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
                </section>

                {/* Call to Action */}
                <section className="text-center space-y-8">
                    <h2 className="text-3xl font-bold text-gray-900">Ready to simplify your workflow?</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Join our growing community of developers who trust Cuteils for their daily tasks.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button size="lg" variant="outline" asChild>
                            <a href="https://github.com/siddhardha123/cuteils" target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" /> Star on GitHub
                            </a>
                        </Button>
                        <Button size="lg" asChild>
                            <a href="https://github.com/siddhardha123/cuteils/issues" target="_blank" rel="noopener noreferrer">
                                <Coffee className="mr-2 h-4 w-4" /> Contribute
                            </a>
                        </Button>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-100 py-8 mt-24">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>Made with 💖 by sid.</p>
                </div>
            </footer>
        </div>
    )
}

