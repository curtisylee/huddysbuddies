import type { TabId } from '../types'

type Props = {
  tab: TabId
  setTab: (t: TabId) => void
}

const items: { id: TabId; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '◐' },
  { id: 'rewards', label: 'Rewards', icon: '★' },
  { id: 'stars', label: 'Stars', icon: '✦' },
]

export function BottomNav({ tab, setTab }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className={`bn-item ${tab === it.id ? 'active' : ''}`}
          onClick={() => setTab(it.id)}
        >
          <span className="bn-ic" aria-hidden>
            {it.icon}
          </span>
          <span className="bn-lb">{it.label}</span>
        </button>
      ))}
    </nav>
  )
}
