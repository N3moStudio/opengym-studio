import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { t, tn } from '../lib/i18n.js'
import { EXIDX, exOr } from '../lib/exercises.js'
import { fmtDate, fmtDur, fmtVol, exerciseNameText } from '../lib/format.js'
import { sessionVolume, workoutDuration, workoutDay, doneUnits, workoutAt } from '../lib/history.js'
import { dayNoteOf, dayNoteLine } from '../lib/day-notes.js'
import { workoutDetailSheet, dayOverrideSheet } from '../sheets.jsx'
import { Thumb } from './Media.jsx'
import Icon from './Icon.jsx'

export function journalRows(S) {
  const workouts = S.workouts || [], trained = new Set(workouts.map(workoutDay))
  const notes = Object.keys(S.dayNotes || {}).filter(d => !trained.has(d)).map(d => ({ d, note: dayNoteLine(dayNoteOf(S, d), t) })).filter(row => row.note)
  return [...workouts.map(w => ({ d: workoutDay(w), w })), ...notes].map((row, i) => ({ ...row, order: i }))
    .sort((a, b) => (b.d || '').localeCompare(a.d || '') || (workoutAt(b.w) || 0) - (workoutAt(a.w) || 0) || b.order - a.order)
}

export function WorkoutJournalCard({ w, S }) {
  const [expanded, setExpanded] = useState(false)
  const entries = w.entries || [], shown = expanded ? entries : entries.slice(0, 3), day = workoutDay(w)
  const open = () => workoutDetailSheet(w)
  return <article className="journal-entry">
    <div className="journal-date"><span>{fmtDate(day, true, true)}</span><button type="button" className="iconbtn" onClick={open} aria-label={t('More') + ': ' + w.name}><Icon name="more" /></button></div>
    <button type="button" className="journal-title" onClick={open}><h2>{w.name || t('Workout')}</h2></button>
    {w.note && <p className="journal-note">{w.note}</p>}
    <dl className="journal-metrics">
      <div><dt>{t('Duration')}</dt><dd>{fmtDur(workoutDuration(w))}</dd></div>
      <div><dt>{t('Volume')}</dt><dd>{fmtVol(sessionVolume(w, S), S.unit)}</dd></div>
      <div><dt>{t('PRs')}</dt><dd className={w.prs?.length ? 'journal-records' : ''}>{w.prs?.length > 0 && <Icon name="trophy" />}{w.prs?.length || '–'}</dd></div>
    </dl>
    <div className="journal-exercises">{shown.map((e, i) => <button type="button" key={e.id + ':' + i} onClick={open}>
      <span className="journal-thumb"><Thumb ex={exOr(e.id)} /></span>
      <span><span className="journal-set-count">{tn('{0} set', '{0} sets', (e.sets || []).reduce((n, s) => n + doneUnits(s), 0))}</span> {EXIDX[e.id] ? exerciseNameText(EXIDX[e.id]) : e.n || e.id}</span>
    </button>)}</div>
    {entries.length > 3 && <button type="button" className="journal-expand" aria-expanded={expanded} onClick={() => setExpanded(x => !x)}>{expanded ? t('Show less') : t('See {0} more exercises', entries.length - 3)}</button>}
    {dayNoteOf(S, day) && <p className="journal-day-note"><Icon name="note" />{dayNoteLine(dayNoteOf(S, day), t)}</p>}
  </article>
}

export default function WorkoutFeed() {
  const S = useStore(s => s.S), [count, setCount] = useState(12), sentinel = useRef(null)
  const rows = useMemo(() => journalRows(S), [S.workouts, S.dayNotes])
  const more = count < rows.length
  useEffect(() => {
    if (!more || typeof IntersectionObserver !== 'function') return
    const observer = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) setCount(n => n + 12) }, { rootMargin: '600px' })
    if (sentinel.current) observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [count, more])
  return <div className="workout-journal">
    {rows.length ? rows.slice(0, count).map((row, i) => row.w ? <WorkoutJournalCard key={row.w.id || i} w={row.w} S={S} /> :
      <article className="journal-entry journal-rest-note" key={'day-' + row.d}><button type="button" onClick={() => dayOverrideSheet(row.d)}><span>{fmtDate(row.d, true)}</span><p><Icon name="note" />{row.note}</p></button></article>) :
      <div className="journal-empty"><Icon name="history" /><h2>{t('Workouts')}</h2><p>{t('No workouts yet. Your first one will land here.')}</p></div>}
    {more && <button type="button" className="journal-expand" ref={sentinel} onClick={() => setCount(n => n + 12)}>{t('Show more')}</button>}
  </div>
}
