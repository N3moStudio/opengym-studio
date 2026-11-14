export function primaryTab(pathname, from) {
  const part = pathname.split('/')[1] || 'home'
  if (['plan', 'library', 'workout'].includes(part)) return 'train'
  if (part === 'muscles') return from === '/stats' ? 'progress' : 'train'
  if (['stats', 'history', 'structural-balance', 'progress-photos', 'measurements'].includes(part)) return 'progress'
  if (['settings', 'admin', 'checkin', 'coach'].includes(part)) return 'you'
  return 'today'
}
