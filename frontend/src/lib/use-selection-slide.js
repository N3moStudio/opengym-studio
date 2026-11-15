import { useLayoutEffect, useRef } from 'react'

// Measure the actual button, including translated labels and RTL order. A single
// thumb owns selection; button backgrounds must never paint a second selection.
export function useSelectionSlide(value, onSelect) {
  const track = useRef(null), thumb = useRef(null), drag = useRef(null), skipClick = useRef(false)
  const position = () => {
    const root = track.current, pill = thumb.current
    const button = root && [...root.querySelectorAll('[data-selection]')].find(b => b.dataset.selection === String(value))
    if (!pill || !button) return
    pill.style.width = button.offsetWidth + 'px'
    pill.style.height = button.offsetHeight + 'px'
    pill.style.top = button.offsetTop + 'px'
    pill.style.transform = `translate3d(${button.offsetLeft}px,0,0)`
    pill.style.visibility = 'visible'
  }
  useLayoutEffect(() => {
    drag.current = null
    if (thumb.current) thumb.current.style.transition = ''
    position()
    const root = track.current
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(position) : null
    if (root) { observer?.observe(root); root.querySelectorAll('[data-selection]').forEach(b => observer?.observe(b)) }
    const cancel = () => { drag.current = null; if (thumb.current) thumb.current.style.transition = ''; position() }
    // Changing language can reverse physical button order without resizing it.
    const direction = typeof MutationObserver === 'function' ? new MutationObserver(cancel) : null
    direction?.observe(document.documentElement, { attributes: true, attributeFilter: ['dir', 'lang'] })
    window.addEventListener('resize', cancel)
    window.addEventListener('blur', cancel)
    document.addEventListener('visibilitychange', cancel)
    return () => { observer?.disconnect(); direction?.disconnect(); window.removeEventListener('resize', cancel); window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', cancel) }
  }, [value]) // geometry is read only on selection/size changes, never in a frame loop
  const restore = () => { if (thumb.current) thumb.current.style.transition = ''; position(); drag.current = null }
  const gestures = onSelect ? {
    onPointerDown(e) {
      if (e.button !== 0 || e.isPrimary === false) return
      const b = e.target.closest('[data-selection]')
      if (!b) return
      skipClick.current = false
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }
    },
    onPointerMove(e) {
      const d = drag.current, root = track.current, pill = thumb.current
      if (!d || d.id !== e.pointerId || !root || !pill) return
      const dx = e.clientX - d.x, dy = e.clientY - d.y
      if (!d.moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 7) { restore(); return }
      if (!d.moved && Math.abs(dx) < 7) return
      if (!d.moved) { d.moved = true; root.setPointerCapture?.(e.pointerId); pill.style.transition = 'none' }
      const r = root.getBoundingClientRect(), buttons = [...root.querySelectorAll('[data-selection]')]
      const first = buttons[0], last = buttons.at(-1)
      const min = Math.min(first.offsetLeft, last.offsetLeft), max = Math.max(first.offsetLeft, last.offsetLeft)
      pill.style.transform = `translate3d(${Math.max(min, Math.min(max, e.clientX - r.left - pill.offsetWidth / 2))}px,0,0)`
    },
    onPointerUp(e) {
      const d = drag.current, root = track.current
      if (!d || d.id !== e.pointerId) return
      if (d.moved && root) {
        const buttons = [...root.querySelectorAll('[data-selection]')]
        const closest = buttons.reduce((best, b) => {
          const r = b.getBoundingClientRect(), distance = Math.abs(e.clientX - r.left - r.width / 2)
          return !best || distance < best.distance ? { b, distance } : best
        }, null)
        skipClick.current = true
        if (thumb.current) thumb.current.style.transition = ''
        drag.current = null
        onSelect(closest.b.dataset.selection)
        // Same-tab drags have no React update to settle the thumb.
        if (closest.b.dataset.selection === String(value)) position()
      } else restore()
    },
    onPointerCancel: restore,
    onLostPointerCapture() { if (drag.current) restore() },
    onClickCapture(e) { if (skipClick.current) { e.preventDefault(); e.stopPropagation(); skipClick.current = false } },
  } : {}
  return { track, thumb, gestures }
}
