import Link from 'next/link'
import { ArrowUpRight, Braces, Clock, KeyRound, Link2, TextCursorInput } from 'lucide-react'

interface ToolCardProps { title: string; description: string; href: string; category: string }

export default function ToolCard({ title, description, href, category }: ToolCardProps) {
  const Icon = category === 'JSON' ? Braces : category === 'Time' ? Clock : category === 'Encoding' ? Link2 : category === 'Text' ? TextCursorInput : KeyRound
  return (
    <Link href={href} className="neo-brutalism-white flex h-full flex-col gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600">
      <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500"><Icon className="h-4 w-4" />{category}</span><ArrowUpRight className="h-5 w-5" aria-hidden="true" /></div>
      <div><h3 className="mb-2 text-xl font-bold">{title}</h3><p className="text-sm leading-6 text-stone-600">{description}</p></div>
    </Link>
  )
}
