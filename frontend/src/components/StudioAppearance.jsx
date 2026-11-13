import { setAppearance, useAppearance, STUDIO_PALETTES } from '../lib/studio-appearance.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'

export const STUDIO_THEMES = {
  bloom: ['Bloom', 'Soft lilac · quiet warmth', '#b7a3db'],
  glacier: ['Glacier', 'Ice blue · open space', '#8dbbd0'],
  afterhours: ['Afterhours', 'Midnight · muted rose', '#c29bae'],
  porcelain: ['Porcelain', 'Chalk · warm stone', '#a8a18e'],
  ion: ['Ion', 'Graphite · soft citron', '#c0c88b'],
  ember: ['Ember', 'Clay · burnished copper', '#d2a18a'],
  blueprint: ['Blueprint', 'Ink · mist blue', '#9cacd4'],
  titanium: ['Titanium', 'Metal · champagne', '#c3b79c'],
}
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
    <span className="studio-settings-copy"><span className="studio-eyebrow">STUDIO COLLECTION</span>
      <strong>Your space.<br />Your pace.</strong><span className="small muted">{STUDIO_THEMES[appearance.palette][0]} · {t(appearance.surface === 'glass' ? 'Glass' : 'Solid')}</span>
      <span className="studio-look-cta">{t('Look & Home')} <Icon name="chevronRight" /></span></span>
    <StudioMiniature palette={appearance.palette} />
  </button>
}
export default function StudioAppearance({ update }) {
  const current = useAppearance()
  const choose = palette => {
    setAppearance({ palette })
    update(s => { s.accent = 'custom'; s.accentCustom = STUDIO_THEMES[palette][2] })
  }
  return <section className="studio-appearance" aria-label={t('Theme')}>
    <div className="studio-collection-heading"><span className="studio-eyebrow">APPEARANCE</span><h2>Make it yours.</h2><p>Eight palettes. One quiet space to train.</p></div>
    <div className="studio-surfaces" role="group" aria-label={t('Surface style')}>
      <button type="button" aria-pressed={current.surface === 'solid'} onClick={() => setAppearance({ surface: 'solid' })}><Icon name="grid" />{t('Solid')}</button>
      <button type="button" aria-pressed={current.surface === 'glass'} onClick={() => setAppearance({ surface: 'glass' })}><Icon name="sparkles" />{t('Glass')}</button>
    </div>
    <div className="studio-palettes" role="group" aria-label={t('Theme')}>
      {STUDIO_PALETTES.map(palette => <button type="button" key={palette} className={'studio-palette' + (current.palette === palette ? ' selected' : '')}
        aria-label={STUDIO_THEMES[palette][0]} aria-pressed={current.palette === palette} onClick={() => choose(palette)}>
        <StudioMiniature palette={palette} /><span className="studio-palette-label">{STUDIO_THEMES[palette][0]}{current.palette === palette && <Icon name="checkCircle" />}</span>
        <span className="studio-palette-detail">{STUDIO_THEMES[palette][1]}</span>
      </button>)}
    </div>
  </section>
}
