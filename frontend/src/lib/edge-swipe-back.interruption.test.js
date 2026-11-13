// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { installEdgeSwipeBack, releaseOf } from './edge-swipe-back.js'

let stop, back, row, mq
const ptr = (type, x, id = 1) => new PointerEvent(type, {
  clientX: x, clientY: 300, pointerId: id, pointerType: 'touch', bubbles: true, cancelable: true,
})
const begin = () => { row.dispatchEvent(ptr('pointerdown', 6)); row.dispatchEvent(ptr('pointermove', 210)) }
beforeEach(() => {
  vi.useFakeTimers()
  document.body.innerHTML = '<div id="app"><div class="page"><button data-back="/home">Back</button><div class="row">Row</div></div></div><div id="modal-root"></div>'
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 })
  mq = new EventTarget(); mq.matches = false
  window.matchMedia = () => mq
  back = document.querySelector('[data-back]'); back.onclick = vi.fn()
  row = document.querySelector('.row')
  stop = installEdgeSwipeBack(window, { enabled: true })
})
afterEach(() => { stop(); vi.useRealTimers(); document.body.innerHTML = '' })

it('can grab a settling page at its moving edge and cancel without a stale navigation', () => {
  begin(); row.dispatchEvent(ptr('pointerup', 210)); vi.advanceTimersByTime(80)
  const page = document.querySelector('.page')
  const before = page.style.transform
  const x = Number(before.match(/translateX\(([-.\d]+)px\)/)[1])
  row.dispatchEvent(ptr('pointerdown', x + 3, 2))
  expect(page.style.transform).toBe(before)
  row.dispatchEvent(ptr('pointermove', 3, 2))
  row.dispatchEvent(ptr('pointerup', 3, 2))
  vi.advanceTimersByTime(600)
  expect(back.onclick).not.toHaveBeenCalled()
  expect(page.style.transform).toBe('')
  expect(document.querySelectorAll('.edge-back-shade')).toHaveLength(0)
})

it.each(['resize', 'reduced-motion', 'unmount', 'modal', 'route'])('%s during a settle never commits later', kind => {
  begin(); row.dispatchEvent(ptr('pointerup', 210)); vi.advanceTimersByTime(64)
  if (kind === 'resize') window.dispatchEvent(new Event('resize'))
  if (kind === 'reduced-motion') { mq.matches = true; mq.dispatchEvent(new Event('change')) }
  if (kind === 'unmount') stop()
  if (kind === 'modal') document.getElementById('modal-root').classList.add('open')
  if (kind === 'route') back.remove()
  vi.advanceTimersByTime(600)
  expect(back.onclick).not.toHaveBeenCalled()
  expect(document.querySelector('.edge-back-shade')).toBeNull()
})

it('respects reversal and pointer cancellation beyond the distance threshold', () => {
  expect(releaseOf({ dx: 250, width: 390, vx: -0.8 })).toBe('cancel')
  begin(); row.dispatchEvent(ptr('pointercancel', 210)); vi.advanceTimersByTime(400)
  expect(back.onclick).not.toHaveBeenCalled()
})

it('does not take an edge drag from text fields', () => {
  const input = document.createElement('input'); row.append(input)
  const down = vi.fn(); input.addEventListener('pointerdown', down)
  input.dispatchEvent(ptr('pointerdown', 6)); input.dispatchEvent(ptr('pointermove', 210)); input.dispatchEvent(ptr('pointerup', 210))
  vi.advanceTimersByTime(400)
  expect(down).toHaveBeenCalledOnce()
  expect(back.onclick).not.toHaveBeenCalled()
})

it('cancels an unfinished transition when the app goes into the background', () => {
  begin(); row.dispatchEvent(ptr('pointerup', 210)); vi.advanceTimersByTime(80)
  const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
  document.dispatchEvent(new Event('visibilitychange'))
  vi.advanceTimersByTime(500)
  expect(back.onclick).not.toHaveBeenCalled()
  expect(document.querySelector('.edge-back-shade')).toBeNull()
  hidden.mockRestore()
})
