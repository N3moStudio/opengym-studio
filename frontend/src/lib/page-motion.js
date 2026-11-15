/* How a page arrives, like Settings on the iPhone: going one level deeper (a settings page from
   Settings) slides it in from the right, going back up slides the parent in from the left, and
   everything else (tabs, a fresh load) keeps the soft fade. Read at mount, from the path it
   replaces. */
export function pageMotion(from, to, navType) {
  // The tabs are the top level: Home is '/', not the parent of every other tab.
  if (!from || from === to || from === '/' || to === '/') return 'fade'
  const tabs = { '/home': 0, '/workout': 1, '/plan': 1, '/library': 1, '/profile': 2, '/stats': 2 }
  if (from in tabs && to in tabs) {
    if (tabs[from] === tabs[to]) return 'fade'
    return tabs[to] > tabs[from] ? 'tab-next' : 'tab-prev'
  }
  if (from === '/home' && to === '/settings') return 'push'
  if (from === '/settings' && to === '/home') return 'pop'
  const deeper = to.startsWith(from.endsWith('/') ? from : from + '/')
  const upper = from.startsWith(to.endsWith('/') ? to : to + '/')
  if (deeper && navType !== 'POP') return 'push'
  if (upper && navType === 'POP') return 'pop'
  return 'fade'
}
