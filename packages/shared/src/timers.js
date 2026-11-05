// Pure timer / stopwatch state transitions and read-outs.
//
// Both are stored as timestamps (not ticking counters) so they stay correct
// across re-renders, app backgrounding and server sync:
//
//   Timer:     { id, label, timerValue, timeToExp, paused, timeLeft }
//              timerValue  total duration in ms
//              timeToExp   epoch ms when it expires (while running)
//              timeLeft    seconds remaining (only while paused, else null)
//
//   Stopwatch: { id, label, markedTime, pausedDiff, paused }
//              markedTime  epoch ms when the current running segment started
//              pausedDiff  ms accumulated before the current segment

// ── Timers ──────────────────────────────────────────────────────

/** Duration in ms from minute/second inputs, or null if the input is invalid. */
export function parseTimerDuration(minutes, seconds) {
  if ((minutes === '' && seconds === '') || isNaN(minutes) || isNaN(seconds)) return null
  return 60000 * (Number(minutes) || 0) + 1000 * (Number(seconds) || 0)
}

export function createTimer({ id, label, timerValue, now = Date.now() }) {
  const timer = { label, timerValue, timeToExp: now + timerValue, paused: false, timeLeft: null }
  return id === undefined ? timer : { id, ...timer }
}

export function resetTimer(timer, now = Date.now()) {
  return { ...timer, timeToExp: now + timer.timerValue, paused: false, timeLeft: null }
}

export function pauseTimer(timer, now = Date.now()) {
  return { ...timer, paused: true, timeLeft: (timer.timeToExp - now) / 1000 }
}

export function resumeTimer(timer, now = Date.now()) {
  return { ...timer, paused: false, timeToExp: now + timer.timeLeft * 1000, timeLeft: null }
}

export function toggleTimer(timer, now = Date.now()) {
  return timer.paused ? resumeTimer(timer, now) : pauseTimer(timer, now)
}

/** Seconds remaining; negative once expired. */
export function getTimerSecondsLeft(timer, now = Date.now()) {
  return timer.paused ? (timer.timeLeft || 0) : (timer.timeToExp - now) / 1000
}

export function isTimerExpired(timer, now = Date.now()) {
  return getTimerSecondsLeft(timer, now) < 0
}

// ── Stopwatches ─────────────────────────────────────────────────

export function createStopwatch({ id, label, startTime, now = Date.now() }) {
  const sw = { label, paused: false, markedTime: startTime ?? now, pausedDiff: 0 }
  return id === undefined ? sw : { id, ...sw }
}

export function resetStopwatch(sw, now = Date.now()) {
  return { ...sw, markedTime: now, pausedDiff: 0 }
}

export function pauseStopwatch(sw, now = Date.now()) {
  return { ...sw, paused: true, pausedDiff: now - sw.markedTime + sw.pausedDiff }
}

export function resumeStopwatch(sw, now = Date.now()) {
  return { ...sw, paused: false, markedTime: now }
}

export function toggleStopwatch(sw, now = Date.now()) {
  return sw.paused ? resumeStopwatch(sw, now) : pauseStopwatch(sw, now)
}

export function getStopwatchElapsedSeconds(sw, now = Date.now()) {
  return sw.paused ? sw.pausedDiff / 1000 : (now - sw.markedTime + sw.pausedDiff) / 1000
}

// ── Formatting ──────────────────────────────────────────────────

/**
 * Split a duration into display parts. Negative durations clamp to zero.
 * Returns e.g. { hours: 1, minutes: 5, seconds: 9, hoursStr: '1:', minutesStr: '05:', secondsStr: '09' }
 */
export function splitDuration(totalSeconds) {
  const s = totalSeconds < 0 ? 0 : totalSeconds
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = Math.floor(s % 60)
  return {
    hours, minutes, seconds,
    hoursStr: hours > 0 ? `${hours}:` : '',
    minutesStr: `${minutes < 10 ? '0' : ''}${minutes}:`,
    secondsStr: seconds < 10 ? `0${seconds}` : `${seconds}`,
  }
}

/** "1:05:09" / "05:09" */
export function formatDuration(totalSeconds) {
  const { hoursStr, minutesStr, secondsStr } = splitDuration(totalSeconds)
  return hoursStr + minutesStr + secondsStr
}

/** Next free numeric id given existing timer/stopwatch lists. */
export function nextId(...lists) {
  const ids = lists.flat().map(x => x.id).filter(id => typeof id === 'number')
  return ids.length ? Math.max(...ids) + 1 : 0
}
