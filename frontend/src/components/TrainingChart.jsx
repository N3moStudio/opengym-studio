import { useMemo, useState } from 'react'
import { t, dateLocale } from '../lib/i18n.js'
import { fmtDur, fmtNum, fmtVol, isoOf, weekStartOf, weekDayOffset } from '../lib/format.js'
import { sessionVolume, workoutDuration, workoutDay, completedRepsOf, metricRowsForEntry } from '../lib/history.js'
import { dropsOf, isSideSet } from '../lib/workout-model.js'
import { Segmented } from './ui.jsx'

// Read-only summaries. Rest-pause `r` already includes its bursts; drops are extra.
export function workoutReps(w) {
  return (w.entries || []).reduce((total, e) => total + metricRowsForEntry(e, 'reps').reduce((n, s) => {
    const sides = isSideSet(s) ? [s.sides.L, s.sides.R].filter(side => side.done) : s.done ? [s] : []
    return n + completedRepsOf(s) + sides.reduce((extra, side) => extra + dropsOf(side).reduce((m, d) => m + Math.max(0, Number(d.r) || 0), 0), 0)
  }, 0), 0)
}

export function trainingWeeks(S, metric, weeks, now = new Date()) {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12)
  monday.setDate(monday.getDate() - weekDayOffset(monday.getDay(), weekStartOf(S)))
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const date = new Date(monday); date.setDate(date.getDate() - 7 * (weeks - 1 - i))
    const end = new Date(date); end.setDate(end.getDate() + 7)
    return { day: isoOf(date), end: isoOf(end), date, value: 0 }
  })
  for (const w of S.workouts || []) {
    const day = workoutDay(w), bucket = day && buckets.find(b => day >= b.day && day < b.end)
    if (bucket) bucket.value += metric === 'duration' ? workoutDuration(w) : metric === 'volume' ? sessionVolume(w, S) : workoutReps(w)
  }
  return buckets
}

export default function TrainingChart({ S, workouts }) {
  const [metric, setMetric] = useState('duration'), [weeks, setWeeks] = useState(13)
  const source = useMemo(() => workouts ? { ...S, workouts } : S, [S, workouts])
  const rows = useMemo(() => trainingWeeks(source, metric, weeks), [source, metric, weeks])
  const max = Math.max(...rows.map(r => r.value), metric === 'duration' ? 3600000 : 1)
  const format = value => metric === 'duration' ? fmtDur(value) : metric === 'volume' ? fmtVol(value, S.unit) : fmtNum(value)
  const label = metric === 'duration' ? t('Duration') : metric === 'volume' ? t('Volume') : t('Reps')
  const step = 300 / rows.length
  return <section className="training-chart" aria-label={label}>
    <div className="training-chart-head"><div><strong>{format(rows.at(-1).value)}</strong> <span>{t('this week')}</span></div>
      <select aria-label={t('Date range')} value={weeks} onChange={e => setWeeks(Number(e.target.value))}>
        <option value={4}>{t('Last 4 weeks')}</option><option value={13}>{t('Last 3 months')}</option><option value={26}>{t('Last 6 months')}</option>
      </select>
    </div>
    <svg className="training-bars" viewBox="0 0 350 170" role="img" aria-label={label + ': ' + format(rows.reduce((n, r) => n + r.value, 0))}>
      {[0, .5, 1].map(part => <g key={part}><line x1="42" x2="342" y1={138 - 120 * part} y2={138 - 120 * part} /><text x="38" y={142 - 120 * part} textAnchor="end">{metric === 'duration' ? fmtNum(max * part / 3600000) + 'h' : Intl.NumberFormat(dateLocale(), { notation: 'compact', maximumFractionDigits: 1 }).format(max * part)}</text></g>)}
      {rows.map((r, i) => <g key={r.day}><rect x={42 + i * step + step * .2} y={138 - r.value / max * 120} width={step * .6} height={r.value / max * 120} rx="1"><title>{r.day + ': ' + format(r.value)}</title></rect>
        {(i % Math.ceil(rows.length / 4) === 0 || i === rows.length - 1) && <text x={42 + (i + .5) * step} y="158" textAnchor="middle">{r.date.toLocaleDateString(dateLocale(), { month: 'short', day: 'numeric' })}</text>}</g>)}
    </svg>
    <Segmented className="seg-metrics" value={metric} onChange={setMetric} options={[{ value: 'duration', label: t('Duration') }, { value: 'volume', label: t('Volume') }, { value: 'reps', label: t('Reps') }]} />
    <details className="chart-data"><summary>{t('Chart data')}</summary><dl>{rows.map(row => <div key={row.day}><dt>{row.date.toLocaleDateString(dateLocale(), { day: 'numeric', month: 'short' })}</dt><dd>{format(row.value)}</dd></div>)}</dl></details>
  </section>
}
