'use client'

import { useState } from 'react'
import { Github, Lock, ArrowRight } from 'lucide-react'
import ToolCard from '@/components/ToolCard'
import Search from '@/components/Search'
import { Button } from '@/components/ui/button'
import { categories, tools } from '@/lib/tools'

export default function Home() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')
  const filtered = tools.filter(tool => (category === 'All' || tool.category === category) && `${tool.title} ${tool.description}`.toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <h1 className="neo-brutalism-pink px-3 py-1 text-2xl font-bold sm:text-3xl">Cuteils 🎀 🛠️</h1>
        <Button variant="outline" asChild><a href="https://github.com/siddhardha123/cuteils" target="_blank" rel="noopener noreferrer"><Github />GitHub</a></Button>
      </header>
      <main className="mx-auto max-w-6xl space-y-10 px-4 pb-12 pt-5 sm:px-6 sm:pt-10">
        <section className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Your everyday developer toolkit</p>
          <h2 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">Tiny tools. Mighty impact.</h2>
          <p className="max-w-2xl text-lg text-stone-600">Format a payload, compare JSON, or convert a timestamp. Pick a tool and get back to what you were building.</p>
          <p className="flex items-center gap-2 text-sm text-stone-500"><Lock className="h-4 w-4" />Free, open source. Tool inputs stay in your browser.</p>
        </section>
        <section id="tools" className="scroll-mt-6 space-y-5" aria-label="Tools">
          <Search value={query} onSearch={setQuery} />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" aria-label="Filter tools by category">
              {categories.map(item => <Button key={item} variant={category === item ? 'default' : 'outline'} size="sm" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</Button>)}
            </div>
            <p role="status" className="text-sm text-stone-500">{filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}</p>
          </div>
          {filtered.length ? <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map(tool => <ToolCard key={tool.href} {...tool} />)}</div> : (
            <div className="border-2 border-dashed border-stone-400 p-10 text-center">
              <p className="font-bold">No tools found</p><p className="mt-2 text-sm text-stone-600">Try a different search or category.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setQuery(''); setCategory('All') }}>Reset filters</Button>
            </div>
          )}
        </section>
        <section className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-black pt-6">
          <div><p className="font-bold">Something missing from your toolkit?</p><p className="mt-1 text-sm text-stone-600">Suggest a tool or contribute on GitHub.</p></div>
          <Button variant="outline" asChild><a href="https://github.com/siddhardha123/cuteils/issues" target="_blank" rel="noopener noreferrer">Suggest a tool<ArrowRight /></a></Button>
        </section>
      </main>
      <footer className="border-t-2 border-black bg-white px-4 py-6 text-center text-sm text-stone-600">Made with 💖 by sid.</footer>
    </div>
  )
}
