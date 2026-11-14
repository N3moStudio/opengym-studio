// Generate Gymaura's app icon, web icons and alternate icon previews before packaging.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { draw, gymauraSVG } from './app-icons.mjs'
import { APP_ICON_VARIANTS } from '../src/lib/app-icon-variants.js'
const root = fileURLToPath(new URL('../', import.meta.url))
const cache = new Map()
function image(v,size) {
  const key = v.id + ':' + size
  if (!cache.has(key)) cache.set(key,draw(v,size))
  return cache.get(key)
}
function save(rel,data) {const p=join(root,rel);mkdirSync(dirname(p),{recursive:true});writeFileSync(p,data)}
const main=APP_ICON_VARIANTS[0]
save('resources/gymaura.svg',gymauraSVG(main.bg,main.fg))
for(const size of [192,512]) save('public/icon-'+size+'.png',image(main,size))
save('public/apple-touch-icon.png',image(main,180))
for(const v of APP_ICON_VARIANTS) {
  save('public/app-icons/'+v.id+'.png',image(v,112))
  if(v.ios) save('ios/App/App/Assets.xcassets/'+v.ios+'.appiconset/icon-1024.png',image(v,1024))
}
for(const target of ['App','Watch']) {
  const folder=join(root,'ios/App',target,'Assets.xcassets/AppIcon.appiconset')
  if(!existsSync(join(folder,'Contents.json'))) continue
  const contents=JSON.parse(readFileSync(join(folder,'Contents.json'),'utf8'))
  for(const icon of contents.images||[]) {
    if(!icon.filename) continue
    const size=Math.round(Number(icon.size?.split('x')[0]||1024)*Number((icon.scale||'1x').replace('x','')))
    writeFileSync(join(folder,icon.filename),image(main,size))
  }
}
console.log('Gymaura app and Watch icons generated')
