import { HOME_CARDS, setAppearance, useAppearance } from '../lib/gymaura-appearance.js'
import { useUI } from '../store/useUI.js'
import { useStore } from '../store/useStore.js'
import { isOn } from '../lib/modules.js'
import { t } from '../lib/i18n.js'
import { Button, Row, Section, Switch } from './ui.jsx'

const cards = [
  ['streak', 'Week streak', 'flame', 'motivation'],
  ['body', 'Body weight', 'scale', 'body'],
  ['recap', 'Week and month recap', 'chart', 'motivation'],
  ['recovery', 'Recovery tips', 'figureStrength', 'health'],
  ['checkin', 'Gym check-in', 'qr', 'checkin'],
  ['challenges', 'Challenges', 'target', 'motivation'],
  ['seasonal', 'Seasonal themes', 'sparkles', 'seasonal'],
]

export function CustomizeHomePanel({ close }) {
  const { home } = useAppearance()
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)
  const previous = { body: 'showWeightCard', recovery: 'recoveryHint', recap: 'recap', challenges: 'monthlyChallenges' }
  const choose = (key, value) => {
    // Earlier versions also have Home switches. Showing a card clears that old hidden flag;
    // hiding it here never disables a feature (e.g. challenge progress remains in Stats).
    if (value && previous[key] && S[previous[key]] === false) update(s => { s[previous[key]] = true })
    setAppearance({ home: { [key]: value } })
  }
  const showAll = () => {
    update(s => { for (const field of Object.values(previous)) s[field] = true })
    setAppearance({ home: Object.fromEntries(Object.keys(HOME_CARDS).map(key => [key, true])) })
  }
  return <>
    <h3>{t('Customize Home')}</h3>
    <p className="gymaura-home-edit-intro">{t('Choose the cards you want on Home. Your features and data stay available in the app.')}</p>
    <div className="gymaura-surfaces" role="group" aria-label={t('Home layout')}>
      <button type="button" onClick={() => setAppearance({ home: HOME_CARDS })}>{t('Keep it simple')}</button>
      <button type="button" onClick={showAll}>{t('Show all')}</button>
    </div>
    <Section>{cards.filter(([, , , mod]) => isOn(S, mod)).map(([key, label, icon]) =>
      <Row key={key} icon={icon} iconTint="var(--acc-ink)" title={t(label)}>
        <Switch checked={home[key] && S[previous[key]] !== false} aria-label={t(label)} onChange={value => choose(key, value)} />
      </Row>)}</Section>
    <Button variant="primary" onClick={close}>{t('Done')}</Button>
  </>
}

export function customizeHome() { useUI.getState().openSheet(close => <CustomizeHomePanel close={close} />) }
