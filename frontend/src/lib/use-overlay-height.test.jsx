// @vitest-environment happy-dom
import React, { act, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import { useOverlayHeight } from './use-overlay-height.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
afterEach(() => { if (root) act(() => root.unmount()); host?.remove(); vi.unstubAllGlobals() })
it('reserves a growing overlay and releases the reservation when it closes', () => {
  let notify
  const disconnect = vi.fn(), observe = vi.fn()
  vi.stubGlobal('ResizeObserver', class { constructor(fn) { notify = fn } observe = observe; disconnect = disconnect })
  function Overlay({ visible }) {
    const ref = useRef(null)
    useOverlayHeight(ref, '--test-overlay-height', visible)
    return visible ? <div ref={ref} /> : null
  }
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host)
  act(() => root.render(<Overlay visible />))
  host.firstChild.getBoundingClientRect = () => ({ height: 127.2 })
  act(() => notify())
  expect(document.documentElement.style.getPropertyValue('--test-overlay-height')).toBe('128px')
  host.firstChild.getBoundingClientRect = () => ({ height: 204 })
  act(() => notify())
  expect(document.documentElement.style.getPropertyValue('--test-overlay-height')).toBe('204px')
  act(() => root.render(<Overlay visible={false} />))
  expect(disconnect).toHaveBeenCalledOnce()
  expect(document.documentElement.style.getPropertyValue('--test-overlay-height')).toBe('')
})
