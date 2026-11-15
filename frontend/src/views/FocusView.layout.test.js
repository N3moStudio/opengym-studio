// Focus mode ran off the right edge of the phone (#655): nine sets put nine 44 px dots under the
// card, and a grid column grows to its widest child, so the dots (and a long exercise name)
// pushed the card past the screen. Checked in Chrome at 412 px: the card
// ended at 548 px before, inside the 16 px gutter after.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(process.cwd(), 'src/views/FocusView.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const rule = sel => css.match(new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\{([^}]*)\\}'))?.[1] || ''

describe('Focus mode stays on the screen (#655)', () => {
  it('keeps its one column no wider than the screen', () => {
    expect(rule('.focus-view')).toMatch(/grid-template-columns:minmax\(0,1fr\)/)
    expect(rule('.focus-pager')).toMatch(/grid-template-columns:auto 44px minmax\(0,1fr\) 44px/)
  })

  it('scrolls many sets without shrinking their touch targets', () => {
    expect(rule('.focus-dots')).toMatch(/overflow-x:auto/)
    const dot = rule('.focus-dots button')
    expect(dot).toMatch(/flex:0 0 44px/)
    expect(dot).toMatch(/min-width:44px/)
  })

  it('breaks a long exercise or superset name instead of widening the card', () => {
    expect(rule('.focus-card-header h2')).toMatch(/min-width:0/)
    expect(rule('.focus-card-header h2')).toMatch(/overflow-wrap:anywhere/)
    expect(rule('.focus-superset-inline strong')).toMatch(/overflow-wrap:anywhere/)
  })
})
