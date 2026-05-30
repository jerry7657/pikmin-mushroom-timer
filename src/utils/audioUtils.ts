let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function beep(frequency: number, duration: number, volume: number) {
  const ac = getCtx()
  const oscillator = ac.createOscillator()
  const gain = ac.createGain()
  oscillator.connect(gain)
  gain.connect(ac.destination)
  oscillator.frequency.value = frequency
  oscillator.type = 'sine'
  gain.gain.setValueAtTime(volume, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
  oscillator.start(ac.currentTime)
  oscillator.stop(ac.currentTime + duration)
}

export function playAlertBeep() {
  beep(880, 0.3, 0.5)
  setTimeout(() => beep(880, 0.3, 0.5), 350)
  setTimeout(() => beep(1100, 0.5, 0.7), 700)
}

export function playEndBeep() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => beep(660, 0.4, 0.8), i * 300)
  }
}
