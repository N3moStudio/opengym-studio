// @vitest-environment happy-dom
import React, { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import { useSelectionSlide } from './use-selection-slide.js'
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
function Control() {
  const [value, setValue] = useState('home')
  const {track, thumb, gestures} = useSelectionSlide(value, setValue)
  return <nav ref={track} {...gestures}><span ref={thumb} data-thumb />{['home','workout','profile'].map((v,i)=><button key={v} data-selection={v} data-i={i} aria-current={v===value?'page':undefined} onClick={()=>setValue(v)}>{v}</button>)}</nav>
}
function mount() {
  vi.spyOn(HTMLElement.prototype,'offsetWidth','get').mockReturnValue(100)
  vi.spyOn(HTMLElement.prototype,'offsetHeight','get').mockReturnValue(48)
  vi.spyOn(HTMLElement.prototype,'offsetTop','get').mockReturnValue(4)
  vi.spyOn(HTMLElement.prototype,'offsetLeft','get').mockImplementation(function(){const i=Number(this.dataset.i)||0;return 4+100*(document.documentElement.dir==='rtl'?2-i:i)})
  host=document.createElement('div');document.body.append(host);root=createRoot(host)
  act(()=>root.render(<Control/>))
}
const pill=()=>host.querySelector('[data-thumb]')
afterEach(()=>{if(root)act(()=>root.unmount());host?.remove();document.documentElement.dir='ltr';vi.restoreAllMocks()})
it('repositions when language reverses button order without a size or selection change',async()=>{
  mount();expect(pill().style.transform).toContain('4px')
  await act(async()=>{document.documentElement.dir='rtl';await new Promise(r=>setTimeout(r,0))})
  expect(pill().style.transform).toContain('204px')
  expect(host.querySelector('[aria-current]').textContent).toBe('home')
})
it('retargets a selection that is interrupted by another tap',()=>{
  mount();act(()=>host.querySelectorAll('button')[2].click());act(()=>host.querySelectorAll('button')[1].click())
  expect(pill().style.transform).toContain('104px')
  expect(host.querySelector('[aria-current]').textContent).toBe('workout')
})
