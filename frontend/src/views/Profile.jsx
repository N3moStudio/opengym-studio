import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'
import { isOn } from '../lib/modules.js'
import { AuraHeader } from '../components/GymauraUI.jsx'
import Icon from '../components/Icon.jsx'
import TrainingChart from '../components/TrainingChart.jsx'
import WorkoutFeed from '../components/WorkoutFeed.jsx'
import { calendarSheet } from '../sheets.jsx'

export default function Profile() {
  const nav = useNavigate(), S = useStore(s => s.S), user = useStore(s => s.user)
  const name = user?.name || t('Profile')
  return <div className="narrow training-profile">
    <AuraHeader title={name} />
    <div className="profile-identity">
      <span className="profile-avatar" aria-hidden="true">{user?.name ? user.name.trim().charAt(0).toUpperCase() : <Icon name="person" />}</span>
      <div><h2>{user?.name ? t('Profile') : 'Gymaura'}</h2><span>{t('Workouts')}</span><strong>{S.workouts.length}</strong></div>
    </div>
    <TrainingChart S={S} />
    <h2 className="journal-section-title">{t('Dashboard')}</h2>
    <div className="profile-destinations">
      <button type="button" data-tour="profile-statistics" onClick={() => nav('/stats')}><Icon name="chart" />{t('Statistics')}</button>
      <button type="button" onClick={() => nav('/library')}><Icon name="dumbbell" />{t('Exercises')}</button>
      {isOn(S, 'body') && <button type="button" onClick={() => nav('/stats?section=body')}><Icon name="ruler" />{t('Measurements')}</button>}
      <button type="button" onClick={() => calendarSheet()}><Icon name="calendar" />{t('Calendar')}</button>
    </div>
    <div className="profile-tools">
      <button type="button" data-tour="profile-overview" onClick={() => nav('/overview')}><Icon name="sparkles" />{t('Training overview')}<Icon name="chevronRight" /></button>
      <button type="button" onClick={() => nav('/history')}><Icon name="history" />{t('History')}<Icon name="chevronRight" /></button>
    </div>
    <h2 className="journal-section-title">{t('Workouts')}</h2>
    <WorkoutFeed />
  </div>
}
