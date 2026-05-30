import { useState, useMemo } from 'react'
import { useMushroomStore } from './store/mushroomStore'
import { useNotification } from './hooks/useNotification'
import { useWakeLock } from './hooks/useWakeLock'
import { getRemaining } from './utils/timeUtils'
import { MushroomCard } from './components/MushroomCard'
import { AddMushroomModal } from './components/AddMushroomModal'
import { SettingsModal } from './components/SettingsModal'
import { PermissionBanner } from './components/PermissionBanner'

export default function App() {
  const { mushrooms, settings, addMushroom, removeMushroom, markNotifiedAlert, markNotifiedEnd, restartMushroom } = useMushroomStore()
  const { permission, requestPermission, notify } = useNotification()
  const [showAdd, setShowAdd] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const hasActive = mushrooms.some(m => getRemaining(m.createdAt, m.baseDuration, m.extension) > 0)
  useWakeLock(hasActive)

  const sorted = useMemo(() =>
    [...mushrooms].sort((a, b) => {
      const ra = getRemaining(a.createdAt, a.baseDuration, a.extension)
      const rb = getRemaining(b.createdAt, b.baseDuration, b.extension)
      if (ra === 0 && rb === 0) return 0
      if (ra === 0) return 1
      if (rb === 0) return -1
      return ra - rb
    }),
    [mushrooms]
  )

  return (
    <div className="min-h-svh flex flex-col max-w-lg mx-auto px-4 py-5 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-300">🍄 搶蘑菇計時器</h1>
        <button
          onClick={() => setShowSettings(true)}
          className="text-gray-400 hover:text-green-300 text-2xl leading-none"
          aria-label="設定"
        >
          ⚙
        </button>
      </div>

      <PermissionBanner permission={permission} onRequest={requestPermission} />

      <div className="flex flex-col gap-3">
        {sorted.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            <div className="text-5xl mb-3">🍄</div>
            <p>還沒有計時中的蘑菇</p>
            <p className="text-sm mt-1">點下方按鈕新增</p>
          </div>
        )}
        {sorted.map(m => (
          <MushroomCard
            key={m.id}
            mushroom={m}
            onRemove={removeMushroom}
            onNotifiedAlert={markNotifiedAlert}
            onNotifiedEnd={markNotifiedEnd}
            onRestart={restartMushroom}
            notify={notify}
          />
        ))}
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-600 active:bg-green-800 text-white text-lg font-bold transition-colors"
        >
          ＋ 新增蘑菇
        </button>
      </div>

      {showAdd && (
        <AddMushroomModal
          defaultExtension={settings.defaultExtension}
          onAdd={addMushroom}
          onClose={() => setShowAdd(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSaved={() => {}}
        />
      )}
    </div>
  )
}
