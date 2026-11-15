import { setAppearance, useAppearance, GYMAURA_PALETTES } from '../lib/gymaura-appearance.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'

export const GYMAURA_THEMES = {
  bloom: ['Bloom', 'Soft lilac · quiet warmth', '#b7a3db'],
  glacier: ['Glacier', 'Ice blue · open space', '#8dbbd0'],
  afterhours: ['Afterhours', 'Midnight · muted rose', '#c29bae'],
  porcelain: ['Porcelain', 'Chalk · warm stone', '#a8a18e'],
  ion: ['Ion', 'Graphite · soft citron', '#c0c88b'],
  ember: ['Ember', 'Clay · burnished copper', '#d2a18a'],
  blueprint: ['Blueprint', 'Ink · mist blue', '#9cacd4'],
  titanium: ['Titanium', 'Metal · champagne', '#c3b79c'],
}
export function GymauraMiniature({ palette = 'bloom' }) {
  return <span className={'gymaura-mini gymaura-mini-' + palette} aria-hidden="true">
    <span className="sm-title" /><span className="sm-sub" />
    <span className="sm-hero"><span /><span /><i /></span>
    <span className="sm-days">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</span>
    <span className="sm-row" /><span className="sm-row" />
    <span className="sm-dock"><i /><b /><i /></span>
  </span>
}
export function GymauraSettingsLink({ onClick }) {
  const appearance = useAppearance()
  return <button type="button" className="gymaura-settings-link" data-tour="settings-look" onClick={onClick}>
    <span className="gymaura-settings-swatch" style={{ background: GYMAURA_THEMES[appearance.palette][2] }} aria-hidden="true"><Icon name="sparkles" /></span>
    <span className="gymaura-settings-copy"><strong>{t('Look & Home')}</strong>
      <span className="small muted">{GYMAURA_THEMES[appearance.palette][0]} · {t(appearance.surface === 'glass' ? 'Glass' : 'Solid')}</span>
    </span><Icon name="chevronRight" />
  </button>
}
export default function GymauraAppearance({ update }) {
  const current = useAppearance()
  const choose = palette => {
    setAppearance({ palette })
    update(s => { s.accent = 'custom'; s.accentCustom = GYMAURA_THEMES[palette][2] })
  }
  return <section className="gymaura-appearance" aria-label={t('Theme')}>
    <div className="gymaura-collection-heading"><h2>{t('Theme')}</h2></div>
    <div className="gymaura-surfaces" role="group" aria-label={t('Surface style')}>
      <button type="button" aria-pressed={current.surface === 'solid'} onClick={() => setAppearance({ surface: 'solid' })}><Icon name="grid" />{t('Solid')}</button>
      <button type="button" aria-pressed={current.surface === 'glass'} onClick={() => setAppearance({ surface: 'glass' })}><Icon name="sparkles" />{t('Glass')}</button>
    </div>
    <div className="gymaura-palettes" role="group" aria-label={t('Theme')}>
      {GYMAURA_PALETTES.map(palette => <button type="button" key={palette} className={'gymaura-palette' + (current.palette === palette ? ' selected' : '')}
        aria-label={GYMAURA_THEMES[palette][0]} aria-pressed={current.palette === palette} onClick={() => choose(palette)}>
        <GymauraMiniature palette={palette} /><span className="gymaura-palette-label">{GYMAURA_THEMES[palette][0]}{current.palette === palette && <Icon name="checkCircle" />}</span>
        <span className="gymaura-palette-detail">{GYMAURA_THEMES[palette][1]}</span>
      </button>)}
    </div>
  </section>
}
