import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Cuteils - Online Utility Tools',
    description: 'A collection of useful online tools for developers',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={`${inter.className}`}>
        <main>
            <Analytics />
            {children}
        </main>
        </body>
        </html>
    )
}

