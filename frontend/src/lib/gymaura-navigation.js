export function primaryTab(pathname, from) {
  const part = pathname.split('/')[1] || 'home'
  if (['plan', 'routine', 'library', 'workout'].includes(part)) return 'workout'
  if (part === 'muscles') return from === '/stats' || from === '/profile' ? 'profile' : 'workout'
  if (['profile', 'overview', 'stats', 'history', 'structural-balance', 'progress-photos', 'measurements'].includes(part)) return 'profile'
  return 'home'
}
