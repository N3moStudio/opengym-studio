// Presentation is device-local. It never changes a plan, export, workout, or sync payload.
import { useSyncExternalStore } from 'react'

const KEY = 'gymaura.appearance.v1'
const LEGACY_KEY = 'opengym.studio.v1' // Read-only migration from Studio build 5.
const EVENT = 'gymaura:appearance'
export const HOME_CARDS = Object.freeze({ recap: false, recovery: false, checkin: false, body: false, streak: true, challenges: false, seasonal: false })
const DEFAULT = Object.freeze({ palette: 'bloom', surface: 'glass', home: HOME_CARDS })
export const GYMAURA_PALETTES = ['bloom', 'glacier', 'afterhours', 'porcelain', 'ion', 'ember', 'blueprint', 'titanium']
let cachedText, cachedValue = DEFAULT

export function normalizeAppearance(value) {
  return {
    palette: GYMAURA_PALETTES.includes(value?.palette) ? value.palette : DEFAULT.palette,
    surface: ['solid', 'glass'].includes(value?.surface) ? value.surface : DEFAULT.surface,
    home: Object.fromEntries(Object.entries(HOME_CARDS).map(([key, fallback]) => [key,
      typeof value?.home?.[key] === 'boolean' ? value.home[key] : fallback])),
  }
}

export function readAppearance() {
  let raw = null
  try {
    raw = localStorage.getItem(KEY)
    if (raw === null) {
      const legacy = localStorage.getItem(LEGACY_KEY)
      if (legacy) {
        // Preserve the user's palette and Home choices; adopt the new glass default once.
        raw = JSON.stringify({ ...JSON.parse(legacy), surface: 'glass' })
        localStorage.setItem(KEY, raw)
      }
    }
  } catch { /* private storage: keep the in-memory choice */ }
  if (raw === cachedText) return cachedValue
  cachedText = raw
  try { cachedValue = normalizeAppearance(JSON.parse(raw)) } catch { cachedValue = DEFAULT }
  return cachedValue
}

function apply(value) {
  document.documentElement.dataset.gymauraPalette = value.palette
  document.documentElement.dataset.gymauraSurface = value.surface
  const meta = document.querySelector('meta[name="theme-color"]')
  const color = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
  if (meta && color) meta.content = color
}

export function setAppearance(patch) {
  const before = readAppearance()
  cachedValue = normalizeAppearance({ ...before, ...patch, home: { ...before.home, ...patch.home } })
  cachedText = JSON.stringify(cachedValue)
  try { localStorage.setItem(KEY, cachedText) } catch { cachedText = null }
  apply(cachedValue)
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(fn) {
  const changed = event => {
    if (event.type === 'storage' && event.key !== KEY && event.key !== null) return
    apply(readAppearance()); fn()
  }
  window.addEventListener(EVENT, changed)
  window.addEventListener('storage', changed)
  return () => { window.removeEventListener(EVENT, changed); window.removeEventListener('storage', changed) }
}

export function useAppearance() { return useSyncExternalStore(subscribe, readAppearance, () => DEFAULT) }
export function initAppearance() { apply(readAppearance()) }
