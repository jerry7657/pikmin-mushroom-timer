import { useState, useEffect } from 'react'

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  useEffect(() => {
    if (permission === 'default') requestPermission()
  }, [])

  const notify = (title: string, body: string) => {
    if (permission !== 'granted') return
    new Notification(title, { body, icon: '/mushroom-icon.png' })
  }

  return { permission, requestPermission, notify }
}
