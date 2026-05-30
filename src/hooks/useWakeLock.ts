import { useEffect, useRef } from 'react'

export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return

    let cancelled = false
    navigator.wakeLock.request('screen').then(lock => {
      if (cancelled) { lock.release(); return }
      lockRef.current = lock
    }).catch(() => {})

    return () => {
      cancelled = true
      lockRef.current?.release()
      lockRef.current = null
    }
  }, [active])
}
