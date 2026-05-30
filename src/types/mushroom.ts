export interface Mushroom {
  id: string
  location: string
  createdAt: number
  baseDuration: number  // seconds input by user
  extension: number     // seconds to add (default 285 = 4:45)
  alertBeforeEnd: number // seconds before end to alert (default 15)
  notifiedAlert: boolean
  notifiedEnd: boolean
}

export type MushroomStatus = 'active' | 'alerting' | 'expired'

export interface AppSettings {
  defaultExtension: number   // seconds, default 285
  defaultAlertBefore: number // seconds, default 15
}
