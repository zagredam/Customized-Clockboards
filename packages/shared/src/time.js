// Calendar / clock-face helpers shared across clock modes.

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** "Thursday, November 5, 2026" */
export function formatLongDate(date) {
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

/** 12-hour clock parts for a Date. */
export function getClockParts(date) {
  const hours = date.getHours()
  return {
    hours12: hours % 12 || 12,
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    meridiem: hours >= 12 ? 'pm' : 'am',
  }
}

export const pad2 = (n) => String(n).padStart(2, '0')
