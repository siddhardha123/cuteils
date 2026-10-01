'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { tools } from '@/lib/tools'

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const tool = tools.find(tool => tool.href === pathname)
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="border-b-2 border-black bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Link href="/" className="neo-brutalism-pink px-3 py-1 text-2xl font-bold">Cuteils 🎀</Link>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <Button variant="outline" asChild><Link href="/#tools"><ArrowLeft />All tools</Link></Button>
            <label className="sr-only" htmlFor="tool-switcher">Switch tool</label>
            <select id="tool-switcher" value={tool?.href ?? ''} onChange={event => router.push(event.target.value)} className="h-10 min-w-0 flex-1 border-2 border-black bg-white px-3 text-sm sm:w-52 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              {!tool && <option value="" disabled>Select a tool</option>}
              {tools.map(item => <option key={item.href} value={item.href}>{item.title}</option>)}
            </select>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-7 px-4 py-8 sm:px-6 sm:py-10">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500">{tool?.category} / Developer tools</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{tool?.title}</h1>
          <p className="max-w-2xl text-stone-600">{tool?.description}</p>
        </div>
        {children}
        <p className="flex items-center gap-2 pt-3 text-xs text-stone-500"><Lock className="h-3.5 w-3.5 shrink-0" />Tool inputs are processed in your browser.</p>
      </main>
    </div>
  )
}
