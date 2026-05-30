import { formatSeconds } from '../utils/timeUtils'
import type { MushroomStatus } from '../types/mushroom'

interface Props {
  seconds: number
  status: MushroomStatus
}

export function TimerDisplay({ seconds, status }: Props) {
  const colorClass =
    status === 'expired' ? 'text-gray-500' :
    status === 'alerting' ? 'text-red-400' :
    seconds <= 60 ? 'text-orange-400' :
    seconds <= 120 ? 'text-yellow-400' :
    'text-green-400'

  return (
    <span
      className={`font-mono text-4xl font-bold tabular-nums tracking-tight ${colorClass} ${status === 'alerting' ? 'animate-alert' : ''}`}
    >
      {status === 'expired' ? '結束' : formatSeconds(seconds)}
    </span>
  )
}
