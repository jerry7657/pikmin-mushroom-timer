import { useReducer, useEffect, useCallback } from 'react'
import type { Mushroom, AppSettings } from '../types/mushroom'

const STORAGE_KEY = 'pikmin-mushrooms'
const SETTINGS_KEY = 'pikmin-settings'

const DEFAULT_SETTINGS: AppSettings = {
  defaultExtension: 285,  // 4:45
  defaultAlertBefore: 15,
}

function loadMushrooms(): Mushroom[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

type Action =
  | { type: 'ADD'; mushroom: Mushroom }
  | { type: 'REMOVE'; id: string }
  | { type: 'MARK_NOTIFIED_ALERT'; id: string }
  | { type: 'MARK_NOTIFIED_END'; id: string }
  | { type: 'RESTART'; id: string; baseDuration: number }
  | { type: 'CLEAR_EXPIRED' }

function reducer(state: Mushroom[], action: Action): Mushroom[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.mushroom]
    case 'REMOVE':
      return state.filter(m => m.id !== action.id)
    case 'MARK_NOTIFIED_ALERT':
      return state.map(m => m.id === action.id ? { ...m, notifiedAlert: true } : m)
    case 'MARK_NOTIFIED_END':
      return state.map(m => m.id === action.id ? { ...m, notifiedEnd: true } : m)
    case 'RESTART':
      return state.map(m => m.id === action.id
        ? { ...m, createdAt: Date.now(), baseDuration: action.baseDuration, notifiedAlert: false, notifiedEnd: false }
        : m)
    case 'CLEAR_EXPIRED':
      return state.filter(m => {
        const total = m.baseDuration + m.extension
        const elapsed = (Date.now() - m.createdAt) / 1000
        return elapsed < total + 30
      })
    default:
      return state
  }
}

export function useMushroomStore() {
  const [mushrooms, dispatch] = useReducer(reducer, undefined, loadMushrooms)
  const settings = loadSettings()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mushrooms))
  }, [mushrooms])

  const addMushroom = useCallback((location: string, baseDuration: number) => {
    const mushroom: Mushroom = {
      id: crypto.randomUUID(),
      location,
      createdAt: Date.now(),
      baseDuration,
      extension: settings.defaultExtension,
      alertBeforeEnd: settings.defaultAlertBefore,
      notifiedAlert: false,
      notifiedEnd: false,
    }
    dispatch({ type: 'ADD', mushroom })
  }, [settings.defaultExtension, settings.defaultAlertBefore])

  const removeMushroom = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const markNotifiedAlert = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFIED_ALERT', id })
  }, [])

  const markNotifiedEnd = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFIED_END', id })
  }, [])

  const restartMushroom = useCallback((id: string, baseDuration: number) => {
    dispatch({ type: 'RESTART', id, baseDuration })
  }, [])

  return { mushrooms, settings, addMushroom, removeMushroom, markNotifiedAlert, markNotifiedEnd, restartMushroom }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export { DEFAULT_SETTINGS }
