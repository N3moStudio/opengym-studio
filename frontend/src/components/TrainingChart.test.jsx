import { expect, it } from 'vitest'
import { trainingWeeks, workoutReps } from './TrainingChart.jsx'
import { makeSideSet, setSideField, toggleSide } from '../lib/workout-model.js'
import { sessionVolume } from '../lib/history.js'

it('counts completed work reps, drops and completed limbs without doubling rest-pause bursts', () => {
  let side = makeSideSet({ w: 10, r: 16, done: false })
  side = setSideField(side, 'L', 'r', 7)
  side = toggleSide(side, 'L')
  const w = { entries: [{ target: { mode: 'reps' }, sets: [
    { r: 10, w: 20, done: true, warmup: true, phase: 'warmup' },
    { r: 8, w: 60, done: true, type: 'dropset', drops: [{ w: 40, r: 4 }] },
    { r: 12, w: 50, done: true, type: 'restpause', clusters: [{ r: 8 }, { r: 4 }] },
    { r: 99, done: false }, side,
  ] }, { target: { mode: 'time' }, sets: [{ sec: 30, r: 999, done: true }] }] }
  const before = JSON.stringify(w)
  expect(workoutReps(w)).toBe(31)
  expect(JSON.stringify(w)).toBe(before)
})

it('uses canonical calendar days and the profile week start, and leaves history unchanged', () => {
  const S = { weekStart: 0, unit: 'kg', workouts: [
    { d: '2026-11-08', start: 0, end: 3600000, entries: [] },
    { d: '2026-11-07', start: 0, end: 1800000, entries: [] },
    { d: '2026-11-15', start: 0, end: 9000000, entries: [] },
  ] }
  const before = JSON.stringify(S)
  const rows = trainingWeeks(S, 'duration', 4, new Date(2026, 10, 14, 12))
  expect(rows.at(-1)).toMatchObject({ day: '2026-11-08', value: 3600000 })
  expect(rows.at(-2).value).toBe(1800000)
  expect(JSON.stringify(S)).toBe(before)
})

it('uses the same volume reader as history, including the saved warm-up preference', () => {
  const w = { d: '2026-11-14', entries: [{ id: '0025', target: { mode: 'reps' }, sets: [{ w: 50, r: 5, done: true }, { w: 20, r: 10, done: true, warmup: true, phase: 'warmup' }] }] }
  for (const volumeWarmups of [false, true]) {
    const S = { unit: 'kg', volumeWarmups, workouts: [w] }
    expect(trainingWeeks(S, 'volume', 4, new Date(2026, 10, 14)).at(-1).value).toBe(sessionVolume(w, S))
  }
})
