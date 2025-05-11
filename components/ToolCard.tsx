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
                className="neo-brutalism-white p-6 h-full flex flex-col justify-between"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
            >
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-black">{title}</h2>
                    <p className="text-gray-700">{description}</p>
                </div>
            </motion.div>
        </Link>
    )
}