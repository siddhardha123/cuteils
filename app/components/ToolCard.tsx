import Link from 'next/link'
import { motion } from 'framer-motion'

interface ToolCardProps {
    title: string
    description: string
    href: string
}

export default function ToolCard({ title, description, href }: ToolCardProps) {
    return (
        <Link href={href}>
            <motion.div
                className="border border-gray-700 rounded-lg p-6 hover:bg-gray-800 transition-colors duration-300 h-full flex flex-col justify-between"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div>
                    <h2 className="text-2xl font-semibold mb-2 text-blue-400">{title}</h2>
                    <p className="text-gray-400">{description}</p>
                </div>
            </motion.div>
        </Link>
    )
}

