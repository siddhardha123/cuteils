'use client'

import { Search as SearchIcon, X } from 'lucide-react'

export default function Search({ value, onSearch }: { value: string; onSearch: (query: string) => void }) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500" />
      <input aria-label="Search tools" type="search" value={value} onChange={event => onSearch(event.target.value)} placeholder="Search tools, e.g. JSON or timestamp..." className="h-14 w-full border-4 border-black bg-white pl-12 pr-14 text-base shadow-[4px_4px_0_0_#000] placeholder:text-stone-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600 [&::-webkit-search-cancel-button]:appearance-none" />
      {value && <button type="button" aria-label="Clear search" onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-pink-100 focus-visible:outline-2 focus-visible:outline-pink-600"><X className="h-5 w-5" /></button>}
    </div>
  )
}
