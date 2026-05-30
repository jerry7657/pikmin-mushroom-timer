/**
 * Parse time string (H:MM:SS, MM:SS, M:SS, or plain seconds) → total seconds.
 * Returns null if invalid.
 */
export function parseTimeInput(input: string): number | null {
  const trimmed = input.trim()

  // Plain number = seconds
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10)
  }

  // Split by ':'
  const parts = trimmed.split(':')
  if (parts.length === 2) {
    const [m, s] = parts
    if (/^\d+$/.test(m) && /^\d{1,2}$/.test(s)) {
      const sec = parseInt(s, 10)
      if (sec > 59) return null
      return parseInt(m, 10) * 60 + sec
    }
  }

  if (parts.length === 3) {
    const [h, m, s] = parts
    if (/^\d+$/.test(h) && /^\d{1,2}$/.test(m) && /^\d{1,2}$/.test(s)) {
      const min = parseInt(m, 10)
      const sec = parseInt(s, 10)
      if (min > 59 || sec > 59) return null
      return parseInt(h, 10) * 3600 + min * 60 + sec
    }
  }

  return null
}

/** Format total seconds → HH:MM:SS or MM:SS */
export function formatSeconds(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60

  const mm = String(m).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')

  if (h > 0) {
    return `${h}:${mm}:${ss}`
  }
  return `${mm}:${ss}`
}

/** Format seconds as human-readable label for settings (e.g. 285 → "4:45") */
export function formatSecondsShort(totalSeconds: number): string {
  return formatSeconds(totalSeconds)
}

export function getRemaining(
  createdAt: number,
  baseDuration: number,
  extension: number
): number {
  const totalDuration = baseDuration + extension
  const elapsed = (Date.now() - createdAt) / 1000
  return Math.max(0, totalDuration - elapsed)
}
