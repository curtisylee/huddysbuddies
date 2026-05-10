import type { TabId } from '../types'

type Props = {
  tab: TabId
  setTab: (t: TabId) => void
}

function TodayIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  )
}

function RewardsIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  )
}

function StarsIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l2.94 6.33L22 9.24l-5 4.58L18.18 21 12 17.27 5.82 21 7 13.82 2 9.24l7.06-.91z" />
    </svg>
  )
}

const items: { id: TabId; label: string; Icon: () => JSX.Element }[] = [
  { id: 'today', label: 'Today', Icon: TodayIcon },
  { id: 'rewards', label: 'Awards', Icon: RewardsIcon },
  { id: 'stars', label: 'Stars', Icon: StarsIcon },
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
            <it.Icon />
          </span>
          <span className="bn-lb">{it.label}</span>
        </button>
      ))}
    </nav>
  )
}
