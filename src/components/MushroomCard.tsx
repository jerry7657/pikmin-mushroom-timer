import { useEffect, useRef, useState } from 'react'
import { getRemaining, parseTimeInput, formatSeconds } from '../utils/timeUtils'
import { playAlertBeep, playEndBeep } from '../utils/audioUtils'
import type { Mushroom, MushroomStatus } from '../types/mushroom'
import { TimerDisplay } from './TimerDisplay'

interface Props {
  mushroom: Mushroom
  onRemove: (id: string) => void
  onNotifiedAlert: (id: string) => void
  onNotifiedEnd: (id: string) => void
  onRestart: (id: string, baseDuration: number) => void
  notify: (title: string, body: string) => void
}

export function MushroomCard({ mushroom, onRemove, onNotifiedAlert, onNotifiedEnd, onRestart, notify }: Props) {
  const [remaining, setRemaining] = useState(() =>
    getRemaining(mushroom.createdAt, mushroom.baseDuration, mushroom.extension)
  )
  const [restartInput, setRestartInput] = useState('')
  const [showRestart, setShowRestart] = useState(false)
  const [restartError, setRestartError] = useState('')
  const restartRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const r = getRemaining(mushroom.createdAt, mushroom.baseDuration, mushroom.extension)
      setRemaining(r)

      if (r <= mushroom.alertBeforeEnd && r > 0 && !mushroom.notifiedAlert) {
        onNotifiedAlert(mushroom.id)
        playAlertBeep()
        notify('🍄 快去打菇！', `${mushroom.location} 還剩 ${Math.ceil(r)} 秒！`)
      }

      if (r === 0 && !mushroom.notifiedEnd) {
        onNotifiedEnd(mushroom.id)
        playEndBeep()
        notify('🍄 時間到！', `${mushroom.location} 的計時已結束`)
      }
    }, 500)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mushroom])

  useEffect(() => {
    if (showRestart) restartRef.current?.focus()
  }, [showRestart])

  const status: MushroomStatus =
    remaining === 0 ? 'expired' :
    remaining <= mushroom.alertBeforeEnd ? 'alerting' :
    'active'

  const borderColor =
    status === 'expired' ? 'border-gray-700' :
    status === 'alerting' ? 'border-red-500' :
    remaining <= 60 ? 'border-orange-500' :
    remaining <= 120 ? 'border-yellow-500' :
    'border-green-700'

  const bgColor =
    status === 'expired' ? 'bg-gray-900/50' :
    status === 'alerting' ? 'bg-red-950/60' :
    'bg-green-950/60'

  const handleRestartSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseTimeInput(restartInput)
    if (parsed === null || parsed <= 0) {
      setRestartError('格式錯誤')
      return
    }
    onRestart(mushroom.id, parsed)
    setShowRestart(false)
    setRestartInput('')
    setRestartError('')
  }

  const parsed = parseTimeInput(restartInput)
  const totalPreview = parsed !== null ? parsed + mushroom.extension : null

  return (
    <div className={`rounded-2xl border-2 ${borderColor} ${bgColor} p-4 flex flex-col gap-2 relative`}>
      <button
        onClick={() => onRemove(mushroom.id)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-400 text-xl leading-none"
        aria-label="刪除"
      >
        ×
      </button>

      <div className="text-sm text-green-300 font-medium pr-6 truncate">{mushroom.location}</div>

      <div className="flex items-end gap-3">
        <TimerDisplay seconds={remaining} status={status} />
        {status === 'alerting' && (
          <span className="text-red-400 text-sm font-bold animate-alert pb-1">立刻出發！</span>
        )}
      </div>

      {status === 'expired' && !showRestart && (
        <button
          onClick={() => setShowRestart(true)}
          className="mt-1 w-full py-2 rounded-xl bg-green-900 hover:bg-green-800 text-green-300 text-sm font-bold"
        >
          🔄 重新計時
        </button>
      )}

      {status === 'expired' && showRestart && (
        <form onSubmit={handleRestartSubmit} className="flex flex-col gap-2 mt-1">
          <div className="flex gap-2">
            <input
              ref={restartRef}
              type="text"
              inputMode="numeric"
              value={restartInput}
              onChange={e => { setRestartInput(e.target.value); setRestartError('') }}
              placeholder="H:MM:SS 或 MM:SS"
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-bold"
            >
              開始
            </button>
            <button
              type="button"
              onClick={() => { setShowRestart(false); setRestartInput(''); setRestartError('') }}
              className="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:bg-gray-800"
            >
              取消
            </button>
          </div>
          {totalPreview !== null && (
            <p className="text-xs text-green-400">倒數 {formatSeconds(totalPreview)}（含延長）</p>
          )}
          {restartError && <p className="text-xs text-red-400">{restartError}</p>}
        </form>
      )}

      <div className="text-xs text-gray-500 flex gap-3">
        <span>延長 +{Math.floor(mushroom.extension / 60)}:{String(mushroom.extension % 60).padStart(2, '0')}</span>
        <span>提前 {mushroom.alertBeforeEnd}s 提醒</span>
      </div>
    </div>
  )
}
