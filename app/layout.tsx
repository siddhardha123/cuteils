import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

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
        <html lang="en" className="dark">
        <body className={`${inter.className} text-white min-h-screen flex flex-col`}>
        <main className="container mx-auto p-6 flex-grow">
            {children}
        </main>
        </body>
        </html>
    )
}

