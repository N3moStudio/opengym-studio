// @vitest-environment happy-dom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import { journalRows, WorkoutJournalCard } from './WorkoutFeed.jsx'
import { workoutDetailSheet } from '../sheets.jsx'
vi.mock('../sheets.jsx', () => ({ workoutDetailSheet: vi.fn(), dayOverrideSheet: vi.fn() }))
vi.mock('./Media.jsx', () => ({ Thumb: () => <span /> }))
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let root, host
afterEach(() => { if (root) act(() => root.unmount()); host?.remove(); root = null })

it('sorts newest first within a day and retains day-only notes without rewriting storage', () => {
  const S = { workouts: [{ id: 'a', d: '2026-11-14', start: 10 }, { id: 'b', d: '2026-11-14', start: 20 }, { id: 'c', d: '2026-11-12', start: 50 }], dayNotes: { '2026-11-13': { text: 'Rest and a walk', _ts: 1 }, '2026-11-14': { text: 'Good session', _ts: 2 } } }
  const before = JSON.stringify(S)
  expect(journalRows(S).map(r => r.w?.id || r.note)).toEqual(['b', 'a', 'Rest and a walk', 'c'])
  expect(JSON.stringify(S)).toBe(before)
})

it('shows session notes and every exercise on demand, and opens the original detail/edit flow', () => {
  const w = { id: 'w', d: '2026-11-14', name: 'Upper', note: 'Slow tempo today', start: 100, end: 3600100, entries: Array.from({ length: 5 }, (_, i) => ({ id: 'missing' + i, n: 'Exercise ' + i, sets: [{ done: true, r: 8, w: 20 }] })) }
  host = document.createElement('div'); document.body.append(host); root = createRoot(host)
  act(() => root.render(<WorkoutJournalCard w={w} S={{ unit: 'kg', dayNotes: {} }} />))
  expect(host.textContent).toContain('Slow tempo today')
  expect(host.querySelectorAll('.journal-exercises>button')).toHaveLength(3)
  act(() => host.querySelector('.journal-expand').click())
  expect(host.querySelectorAll('.journal-exercises>button')).toHaveLength(5)
  act(() => host.querySelector('.journal-title').click())
  expect(workoutDetailSheet).toHaveBeenCalledWith(w)
})
