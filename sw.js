// Pikmin Bloom 搶蘑菇計時器 — Service Worker
// Handles background notifications when the page is not focused.

const scheduled = new Map() // id → { alertTimer, endTimer }

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('message', event => {
  const data = event.data
  if (!data?.type) return

  if (data.type === 'SCHEDULE') {
    const { id, location, alertAt, endsAt, iconUrl } = data

    // Cancel any existing timers for this id
    cancel(id)

    const now = Date.now()

    const alertDelay = alertAt - now
    const endDelay = endsAt - now

    const alertTimer = alertDelay > 0
      ? setTimeout(() => showIfBackground(`alert-${id}`, '🍄 準備打菇！', `${location} 即將可以打！`, iconUrl), alertDelay)
      : null

    const endTimer = endDelay > 0
      ? setTimeout(() => showIfBackground(`end-${id}`, '🍄 時間到！', `${location} 計時結束`, iconUrl), endDelay)
      : null

    scheduled.set(id, { alertTimer, endTimer })
  }

  if (data.type === 'CANCEL') {
    cancel(data.id)
  }
})

function cancel(id) {
  const entry = scheduled.get(id)
  if (entry) {
    clearTimeout(entry.alertTimer)
    clearTimeout(entry.endTimer)
    scheduled.delete(id)
  }
}

async function showIfBackground(tag, title, body, icon) {
  // Only show notification if no focused page is open
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const hasFocused = clients.some(c => c.focused)
  if (hasFocused) return

  self.registration.showNotification(title, {
    body,
    icon,
    tag,
    renotify: true,
    requireInteraction: false,
  })
}
