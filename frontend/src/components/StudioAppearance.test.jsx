// @vitest-environment happy-dom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import StudioAppearance from './StudioAppearance.jsx'
import { normalizeAppearance, readAppearance, STUDIO_PALETTES } from '../lib/studio-appearance.js'

let host, root
beforeEach(() => {
  localStorage.clear()
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div'); document.body.append(host); root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove() })
it('uses opaque surfaces on a fresh installation', () => {
  expect(normalizeAppearance(null).surface).toBe('solid')
})
it('keeps the existing palette, glass preference and Home choices on upgrade', () => {
  const old = { palette:'titanium', surface:'glass', home:{body:true,streak:false} }
  const upgraded = normalizeAppearance(old)
  expect(upgraded).toMatchObject(old)
})
it('recovers a malformed stored preference without losing the theme chooser', () => {
  localStorage.setItem('opengym.studio.v1','{broken')
  act(() => root.render(<StudioAppearance update={() => {}} />))
  expect(host.querySelectorAll('.studio-palette')).toHaveLength(8)
  expect(readAppearance().palette).toBe('bloom')
})
it.each(STUDIO_PALETTES)('selects and persists %s without changing Home choices', palette => {
  localStorage.setItem('opengym.studio.v1',JSON.stringify({palette:'bloom',surface:'solid',home:{body:true,streak:false}}))
  const account = { workouts:[{id:'preserve-workout'}] }
  const update = vi.fn(fn => fn(account))
  act(() => root.render(<StudioAppearance update={update} />))
  act(() => host.querySelector(`[aria-label="${palette[0].toUpperCase()+palette.slice(1)}"]`).click())
  expect(readAppearance()).toMatchObject({palette,home:{body:true,streak:false}})
  expect(JSON.parse(localStorage.getItem('opengym.studio.v1')).palette).toBe(palette)
  expect(host.querySelectorAll('.studio-palette[aria-pressed="true"]')).toHaveLength(1)
  expect(account.workouts).toEqual([{id:'preserve-workout'}])
  expect(account.accentCustom).toMatch(/^#[a-f0-9]{6}$/)
})
it('switches material independently from the palette', () => {
  act(() => root.render(<StudioAppearance update={() => {}} />))
  act(() => host.querySelectorAll('.studio-surfaces button')[1].click())
  expect(readAppearance()).toMatchObject({surface:'glass',palette:'bloom'})
  act(() => host.querySelectorAll('.studio-surfaces button')[0].click())
  expect(readAppearance().surface).toBe('solid')
})
