import { useNavigate, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import { retapTab } from '../lib/scroll-top.js'
import { t } from '../lib/i18n.js'

export function AuraMark() {
  return <svg className="aura-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M36 15a16 16 0 1 0 2 16H25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M31 7a19 19 0 0 1 11 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".45" />
    <circle cx="37" cy="15" r="3" fill="currentColor" />
  </svg>
}
export function AuraHeader({ title, subtitle, eyebrow = 'GYMAURA', children }) {
  return <header className="aura-header"><div className="aura-heading">
    <span className="aura-eyebrow">{eyebrow}</span><h1>{title}</h1>
    {subtitle && <p>{subtitle}</p>}
  </div>{children && <div className="aura-header-actions">{children}</div>}</header>
}
export function TrainNavigation() {
  const nav = useNavigate(), { pathname } = useLocation()
  const items = [['/plan', 'calendar', 'Routines'], ['/library', 'dumbbell', 'Exercises'], ['/plan/programmes', 'clipboard', 'Programmes']]
  return <nav className="aura-subnav" aria-label={t('Train')}>
    {items.map(([path, icon, title]) => <button type="button" key={path}
      data-tour={path === '/library' ? 'tab-library' : undefined} aria-current={pathname === path ? 'page' : undefined} onClick={() => pathname === path ? retapTab(path) : nav(path, { replace: true })}>
      <Icon name={icon} /><span>{t(title)}</span>
    </button>)}
  </nav>
}
export function AuraStat({ label, value, detail }) {
  return <div className="aura-stat"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>
}
export function AuraLink({ icon, title, subtitle, onClick }) {
  return <button type="button" className="aura-link" onClick={onClick}>
    <span className="aura-link-icon"><Icon name={icon} /></span><span><strong>{title}</strong>{subtitle && <small>{subtitle}</small>}</span>
    <Icon name="chevronRight" className="aura-link-arrow" />
  </button>
}
