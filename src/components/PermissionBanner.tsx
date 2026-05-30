interface Props {
  permission: NotificationPermission
  onRequest: () => void
}

export function PermissionBanner({ permission, onRequest }: Props) {
  if (permission === 'granted') return null

  return (
    <div className="bg-yellow-900/60 border border-yellow-700 rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-sm">
      <span className="text-yellow-200">
        {permission === 'denied'
          ? '🔔 通知已被封鎖，請在瀏覽器設定中開啟'
          : '🔔 開啟通知以接收蘑菇提醒'}
      </span>
      {permission === 'default' && (
        <button
          onClick={onRequest}
          className="shrink-0 bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg font-bold text-xs"
        >
          開啟
        </button>
      )}
    </div>
  )
}
