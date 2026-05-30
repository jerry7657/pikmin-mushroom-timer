import { useState, useRef, useEffect } from 'react'
import { parseTimeInput, formatSeconds } from '../utils/timeUtils'

interface Props {
  defaultExtension: number
  onAdd: (location: string, baseDuration: number) => void
  onClose: () => void
}

export function AddMushroomModal({ defaultExtension, onAdd, onClose }: Props) {
  const [location, setLocation] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [error, setError] = useState('')
  const locationRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    locationRef.current?.focus()
  }, [])

  const parsed = parseTimeInput(timeInput)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location.trim()) { setError('請輸入地點名稱'); return }
    if (parsed === null) { setError('時間格式錯誤（例如：1:30:00 或 5:00）'); return }
    onAdd(location.trim(), parsed)
    onClose()
  }

  const totalSeconds = parsed !== null ? parsed + defaultExtension : null

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900 border border-green-800 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-green-300 mb-4">新增蘑菇計時</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">地點名稱</label>
            <input
              ref={locationRef}
              type="text"
              value={location}
              onChange={e => { setLocation(e.target.value); setError('') }}
              placeholder="例如：中正公園藍菇"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">蘑菇目前剩餘時間</label>
            <input
              type="text"
              inputMode="numeric"
              value={timeInput}
              onChange={e => { setTimeInput(e.target.value); setError('') }}
              placeholder="H:MM:SS 或 MM:SS"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 font-mono"
            />
            {totalSeconds !== null && (
              <p className="text-xs text-green-400 mt-1">
                計時器將倒數 {formatSeconds(totalSeconds)}（含延長 {formatSeconds(defaultExtension)}）
              </p>
            )}
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white font-bold"
            >
              開始計時
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
