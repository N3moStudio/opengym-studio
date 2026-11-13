import { setAppearance, useAppearance, STUDIO_PALETTES } from '../lib/studio-appearance.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'

const names = { bloom: 'Bloom', glacier: 'Glacier', titanium: 'Titanium' }

// A miniature of the actual composition, not a downloaded image or a second live app.
export function StudioMiniature({ palette = 'bloom' }) {
  return <span className={'studio-mini studio-mini-' + palette} aria-hidden="true">
    <span className="sm-title" /><span className="sm-sub" />
    <span className="sm-hero"><span /><span /><i /></span>
    <span className="sm-days">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</span>
    <span className="sm-row" /><span className="sm-row" />
    <span className="sm-dock"><i /><i /><b /><i /><i /></span>
  </span>
}

export function StudioSettingsLink({ onClick }) {
  const appearance = useAppearance()
  return <button type="button" className="studio-settings-link" data-tour="settings-look" onClick={onClick}>
    <span className="studio-settings-copy"><Icon name="palette" /><span className="lbl2">openGym Studio</span>
      <strong>{t('Look & Home')}</strong><span className="small muted">{names[appearance.palette]}</span></span>
    <StudioMiniature palette={appearance.palette} /><Icon name="chevronRight" className="studio-settings-chevron" />
  </button>
}

export default function StudioAppearance({ update }) {
  const current = useAppearance()
  const choose = palette => {
    setAppearance({ palette })
    update(s => { s.accent = { bloom: 'violet', glacier: 'sky', titanium: 'gold' }[palette] })
  }
  return <section className="studio-appearance" aria-label={t('Theme')}>
    <div className="studio-appearance-head"><Icon name="palette" /><span>openGym Studio</span></div>
    <div className="studio-palettes" role="group" aria-label={t('Theme')}>
      {STUDIO_PALETTES.map(palette => <button type="button" key={palette} className={'studio-palette' + (current.palette === palette ? ' selected' : '')}
        aria-pressed={current.palette === palette} onClick={() => choose(palette)}>
        <StudioMiniature palette={palette} /><span className="studio-palette-label">{names[palette]}{current.palette === palette && <Icon name="checkCircle" />}</span>
      </button>)}
    </div>
    <div className="studio-surfaces" role="group" aria-label={t('Surface style')}>
      <button type="button" aria-pressed={current.surface === 'solid'} onClick={() => setAppearance({ surface: 'solid' })}><Icon name="grid" />{t('Solid')}</button>
      <button type="button" aria-pressed={current.surface === 'glass'} onClick={() => setAppearance({ surface: 'glass' })}><Icon name="sparkles" />{t('Glass')}</button>
    </div>
  </section>
}
