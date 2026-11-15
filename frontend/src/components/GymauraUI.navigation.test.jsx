// @vitest-environment happy-dom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { TrainNavigation } from './GymauraUI.jsx'
import Plan from '../views/Plan.jsx'
import { DEF, useStore } from '../store/useStore.js'
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root, router, saved
beforeEach(() => {
  saved = useStore.getState().S
  useStore.setState({ S: structuredClone(DEF) })
  localStorage.removeItem('gym_plan_view')
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host)
  router = createMemoryRouter([
    { path: '/plan', element: <Plan /> },
    { path: '/library', element: <TrainNavigation /> },
    { path: '/plan/programmes', element: <TrainNavigation /> },
  ], { initialEntries: ['/library'] })
  act(() => root.render(<RouterProvider router={router} />))
})
afterEach(() => {
  act(() => root.unmount()); router.dispose(); host.remove()
  useStore.setState({ S: saved }); localStorage.removeItem('gym_plan_view')
})
const tap = async label => {
  const button = [...host.querySelectorAll('.aura-subnav button')].find(b => b.textContent === label)
  await act(async () => button.click())
}
it('reaches and remembers both planning destinations without changing training data', async () => {
  const before = JSON.stringify(useStore.getState().S)
  await tap('Routines')
  expect(router.state.location.search).toBe('?view=routines')
  expect(localStorage.getItem('gym_plan_view')).toBe('routines')
  expect(host.querySelector('[aria-current="page"]').textContent).toBe('Routines')
  await tap('Schedule')
  expect(localStorage.getItem('gym_plan_view')).toBe('schedule')
  await tap('Exercises')
  expect(router.state.location.pathname).toBe('/library')
  await act(async () => router.navigate('/plan')) // legacy URL still honors the preference
  expect(host.querySelector('[aria-current="page"]').textContent).toBe('Schedule')
  await act(async () => router.navigate('/plan?view=unknown'))
  expect(host.querySelector('[aria-current="page"]').textContent).toBe('Schedule')
  expect(JSON.stringify(useStore.getState().S)).toBe(before)
})
