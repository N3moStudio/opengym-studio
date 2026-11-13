// @vitest-environment happy-dom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { CustomizeHomePanel } from './CustomizeHome.jsx'
import { useStore } from '../store/useStore.js'
import { HOME_CARDS, readAppearance, setAppearance, normalizeAppearance } from '../lib/studio-appearance.js'
import StudioAppearance from './StudioAppearance.jsx'

let host, root
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  localStorage.removeItem('opengym.studio.v1')
  setAppearance({ palette: 'bloom', surface: 'glass', home: HOME_CARDS })
  useStore.setState(({ S }) => ({ S: { ...S, modules: {}, showWeightCard: true, monthlyChallenges: true,
    routines: [{ id: 'r', name: 'Upper A', ex: [] }], workouts: [], bodyweight: [] } }))
  host = document.createElement('div'); document.body.append(host); root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove(); localStorage.removeItem('opengym.studio.v1') })
const button = label => [...host.querySelectorAll('button')].find(b => (b.getAttribute('aria-label') || b.textContent) === label)

it('defaults to a simple Home and sanitizes unknown or corrupt choices', () => {
  expect(readAppearance().home.body).toBe(false)
  expect(readAppearance().home.streak).toBe(true)
  expect(normalizeAppearance({ palette: 'bogus', surface: 'bad', home: { body: 'yes', recovery: true } }))
    .toEqual({ palette: 'bloom', surface: 'solid', home: { ...HOME_CARDS, recovery: true } })
})

it('shows and hides cards without changing routines, logs, measurements or modules', () => {
  const before = structuredClone(useStore.getState().S)
  act(() => root.render(<CustomizeHomePanel close={vi.fn()} />))
  const weight = host.querySelector('[role="switch"][aria-label="Body weight"]')
  expect(weight.getAttribute('aria-checked')).toBe('false')
  act(() => weight.click())
  expect(readAppearance().home.body).toBe(true)
  act(() => button('Keep it simple').click())
  expect(readAppearance().home.body).toBe(false)
  expect(useStore.getState().S).toEqual(before)
})

it('Show all also makes cards visible that an older Home setting had hidden', () => {
  useStore.setState(({ S }) => ({ S: { ...S, showWeightCard: false, recap: false } }))
  act(() => root.render(<CustomizeHomePanel close={vi.fn()} />))
  act(() => button('Show all').click())
  expect(Object.values(readAppearance().home).every(Boolean)).toBe(true)
  expect(useStore.getState().S.showWeightCard).toBe(true)
  expect(useStore.getState().S.recap).toBe(true)
})

it('changing a palette and surface keeps all custom Home choices', () => {
  setAppearance({ home: { body: true, streak: false } })
  act(() => root.render(<StudioAppearance update={useStore.getState().update} />))
  act(() => button('Glacier').click())
  act(() => button('Solid').click())
  expect(readAppearance()).toMatchObject({ palette: 'glacier', surface: 'solid', home: { body: true, streak: false } })
  expect(document.documentElement.dataset.studioPalette).toBe('glacier')
  expect(useStore.getState().S.routines[0].name).toBe('Upper A')
})
