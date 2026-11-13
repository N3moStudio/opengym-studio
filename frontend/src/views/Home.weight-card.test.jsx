// @vitest-environment happy-dom
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { useStore } from '../store/useStore.js'
import Home from './Home.jsx'
import { setAppearance, HOME_CARDS } from '../lib/studio-appearance.js'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../sheets.jsx', () => ({
  starterPlanSheet: vi.fn(), bwSheet: vi.fn(), goalSheet: vi.fn(), dayOverrideSheet: vi.fn(),
  calendarSheet: vi.fn(), startFlow: vi.fn(), bwDeltaColor: () => '',
}))

let host, root
beforeEach(() => {
  // These legacy card tests explicitly opt into the expanded Home.
  setAppearance({ home: Object.fromEntries(Object.keys(HOME_CARDS).map(key => [key, true])) })
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove() })

const mountWith = showWeightCard => {
  useStore.setState(s => ({
    S: { ...s.S, routines: [], workouts: [], bodyweight: [], dayPlan: {}, week: {}, active: null, showWeightCard },
    user: null,
  }))
  act(() => root.render(<Home />))
}
const weightHeading = () => [...host.querySelectorAll('.card-head-title')].find(el => el.textContent === 'Body weight')

describe('Home body-weight card preference', () => {
  it('shows the card for legacy profiles without the preference', () => {
    mountWith(undefined)
    expect(weightHeading()).toBeTruthy()
  })

  it('shows the card when enabled', () => {
    mountWith(true)
    expect(weightHeading()).toBeTruthy()
  })

  it('hides only the Home card when disabled', () => {
    mountWith(false)
    expect(weightHeading()).toBeFalsy()
  })
})