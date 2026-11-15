import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'
import { AuraHeader } from '../components/GymauraUI.jsx'
import { Button } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import WorkoutFeed from '../components/WorkoutFeed.jsx'
import { useConnectionTrouble } from '../components/SyncBanner.jsx'
import { logPastWorkoutSheet } from '../sheets.jsx'

export default function Home() {
  const nav = useNavigate(), active = useStore(s => s.S.active)
  const trouble = useConnectionTrouble()
  return <div className="narrow journal-home">
    <AuraHeader title={t('Home')}>
      <button type="button" className="iconbtn" onClick={logPastWorkoutSheet} aria-label={t('Log a past workout')}><Icon name="plus" /></button>
      <button type="button" className="iconbtn" data-tour="settings-gear" onClick={() => nav('/settings')}
        aria-label={trouble ? t('Settings') + ', ' + t('Connection problem') : t('Settings')}>
        <Icon name="gear" />{trouble && <span className="tab-dot" />}
      </button>
    </AuraHeader>
    <Button className="journal-start" variant="tinted" icon={active ? 'play' : 'plus'} data-tour="today" onClick={() => nav('/workout')}>
      {t(active ? active.editingWorkoutId ? 'Edit workout' : 'Resume workout' : 'Start workout')}
    </Button>
    <WorkoutFeed />
  </div>
}
