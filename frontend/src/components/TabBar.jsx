import { useRef } from 'react'
import { useOverlayHeight } from '../lib/use-overlay-height.js'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import Elapsed from './Elapsed.jsx'
import { useConnectionTrouble } from './SyncBanner.jsx'
import { retapTab } from '../lib/scroll-top.js'

import { primaryTab } from '../lib/gymaura-navigation.js'
import { useSelectionSlide } from '../lib/use-selection-slide.js'

export default function TabBar() {
  const nav = useNavigate(), loc = useLocation()
  const S = useStore(s => s.S), user = useStore(s => s.user), guest = useStore(s => s.isGuest())
  const trouble = useConnectionTrouble()
  const dockRef = useRef(null)
  useOverlayHeight(dockRef, '--navigation-height', !!(user || guest), loc.pathname)
  const current = primaryTab(loc.pathname, loc.state?.from)
  const switchTab = path => loc.pathname === path && !loc.search ? retapTab(path) : nav(path, { replace: true })
  const live = S.active && !S.active.editingWorkoutId && !S.active.backfill && S.active.start > 0
  const tabs = [
    ['home', '/home', 'house', 'Home', 'tab-home'],
    ['workout', '/workout', 'dumbbell', 'Workout', 'tab-plan'],
    ['profile', '/profile', 'person', 'Profile', 'tab-stats'],
  ]
  const { track, thumb, gestures } = useSelectionSlide(current, id => switchTab(tabs.find(tab => tab[0] === id)[1]))
  if (!user && !guest) return null
  return <div className="aura-dock-wrap" ref={dockRef}>
    {S.active && loc.pathname !== '/workout' && <button type="button" className="aura-session-dock" onClick={() => nav('/workout')}>
      <span className="aura-session-pulse" aria-hidden="true" /><span className="aura-session-dock-name">{S.active.name || t('Workout')}</span>
      {live && <Elapsed start={S.active.start} />}<strong>{t(S.active.editingWorkoutId ? 'Edit workout' : 'Resume')}</strong><Icon name="play" />
    </button>}
    <nav id="tabbar" className="aura-dock" aria-label="Gymaura" ref={track} {...gestures}>
      <span className="dock-selection" ref={thumb} aria-hidden="true" />
      {tabs.map(([id, path, icon, label, tour]) => <button type="button" key={id} data-tour={tour}
        data-selection={id}
        className={current === id ? 'on' : ''} aria-current={current === id ? 'page' : undefined}
        aria-label={id === 'home' && trouble ? t(label) + ', ' + t('Connection problem') : t(label)} onClick={() => switchTab(path)}>
        <span className="tab-ic"><Icon name={icon} />{id === 'home' && trouble && <span className="tab-dot" />}</span><span>{t(label)}</span>
      </button>)}
    </nav>
  </div>
}
