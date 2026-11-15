import { useLayoutEffect } from 'react'

// Content can grow with localization, text size, a resumed session, or an automatic timer.
// Reserve its measured height so the last page action can always scroll above the overlay.
export function useOverlayHeight(ref, property, visible, variant = '') {
  useLayoutEffect(() => {
    const root = document.documentElement
    const node = ref.current
    if (!visible || !node) return
    const measure = () => root.style.setProperty(property, Math.ceil(node.getBoundingClientRect().height) + 'px')
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(node)
    return () => { observer?.disconnect(); root.style.removeProperty(property) }
  }, [ref, property, visible, variant])
}
