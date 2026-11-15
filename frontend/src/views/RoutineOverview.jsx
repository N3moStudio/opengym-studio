import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'
import { exerciseNameText } from '../lib/format.js'
import { exOr } from '../lib/exercises.js'
import { setsRepsOf, setLabel, modeOf, isBw } from '../lib/history.js'
import { ownExerciseRest } from '../lib/supersetFlow.js'
import { fmtRest } from '../lib/duration.js'
import { buildPlannedEntry } from '../lib/session-start.js'
import { exView, viewEntry } from '../lib/ex-unit.js'
import { speedUnitOf } from '../lib/speed.js'
import { startFlow, exerciseDetailSheet } from '../sheets.jsx'
import { AuraHeader } from '../components/GymauraUI.jsx'
import { Button } from '../components/ui.jsx'
import { Thumb } from '../components/Media.jsx'
import TrainingChart from '../components/TrainingChart.jsx'
import Icon from '../components/Icon.jsx'

export default function RoutineOverview() {
  const { id } = useParams(), nav = useNavigate(), S = useStore(s => s.S)
  const routine = S.routines.find(r => r.id === id)
  const workouts = useMemo(() => S.workouts.filter(w => w.routineId === id || w.routineIds?.includes(id)), [S.workouts, id])
  if (!routine) return <div className="narrow"><AuraHeader title={t('Routine')} /><Button onClick={() => nav('/workout')}>{t('Back')}</Button></div>
  return <div className="narrow routine-overview">
    <AuraHeader title={t('Routine')}><button type="button" className="iconbtn" data-back="/workout" aria-label={t('Back')} onClick={() => nav('/workout')}><Icon name="chevronLeft" /></button>
      <button type="button" className="iconbtn" aria-label={t('Edit routine')} onClick={() => nav('/plan/r/' + id)}><Icon name="pencil" /></button></AuraHeader>
    <h2 className="routine-detail-name">{routine.name}</h2>
    {routine.note && <p className="journal-note">{routine.note}</p>}
    <Button className="routine-detail-start" variant="primary" onClick={() => startFlow([id])}>{t('Start routine')}</Button>
    {workouts.length > 0 && <TrainingChart S={S} workouts={workouts} />}
    <div className="aura-section-head"><h2>{t('Exercises')}</h2><Button size="sm" variant="ghost" onClick={() => nav('/plan/r/' + id)}>{t('Edit routine')}</Button></div>
    {routine.ex.map((cfg, i) => {
      const ex = exOr(cfg.id), V = exView(S, cfg.id), entry = viewEntry(S, buildPlannedEntry(S, cfg, routine)), rest = ownExerciseRest(cfg) ?? S.restSec
      return <section className="routine-exercise" key={cfg.id + ':' + i}>
        <button type="button" className="routine-exercise-name" onClick={() => exerciseDetailSheet(ex)}><Thumb ex={ex} /><h3>{exerciseNameText(ex)}</h3></button>
        {cfg.note && <p className="journal-note">{cfg.note}</p>}
        <div className="routine-prescription">{setsRepsOf(cfg)}{modeOf(cfg) === 'reps' && (!isBw(cfg) || entry.sets.some(set => set.w > 0)) ? ' · ' + V.unit : ''}</div>
        <p className="routine-prescription"><Icon name="timer" /> {t('Rest timer')}: {rest ? fmtRest(rest) : t('Off')}</p>
        <ol className="routine-prescription-sets">{entry.sets.map((set, n) => <li key={n}><span>{n + 1}</span><span>{setLabel(cfg.id, set, entry.target, speedUnitOf(V))}</span></li>)}</ol>
      </section>
    })}
  </div>
}
