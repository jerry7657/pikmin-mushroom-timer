import { useState } from 'react'
import { parseTimeInput, formatSeconds } from '../utils/timeUtils'
import type { AppSettings } from '../types/mushroom'
import { saveSettings } from '../store/mushroomStore'

interface Props {
  settings: AppSettings
  onClose: () => void
  onSaved: () => void
}

export function SettingsModal({ settings, onClose, onSaved }: Props) {
  const [extensionInput, setExtensionInput] = useState(formatSeconds(settings.defaultExtension))
  const [alertInput, setAlertInput] = useState(String(settings.defaultAlertBefore))
  const [error, setError] = useState('')

  const handleSave = () => {
    const ext = parseTimeInput(extensionInput)
    const alert = parseInt(alertInput, 10)
    if (ext === null || ext <= 0) { setError('延長時間格式錯誤'); return }
    if (isNaN(alert) || alert < 5 || alert > 300) { setError('提前提醒秒數需在 5～300 秒之間'); return }
    saveSettings({ defaultExtension: ext, defaultAlertBefore: alert })
    onSaved()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900 border border-green-800 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-green-300 mb-4">設定</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">預設延長時間（H:MM:SS 或 MM:SS）</label>
            <input
              type="text"
              value={extensionInput}
              onChange={e => { setExtensionInput(e.target.value); setError('') }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">提前幾秒提醒（秒）</label>
            <input
              type="number"
              value={alertInput}
              onChange={e => { setAlertInput(e.target.value); setError('') }}
              min={5}
              max={300}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
            />
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
              onClick={handleSave}
              className="flex-1 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white font-bold"
            >
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
