import { useEffect, useState } from 'react'

/** Re-renders every `intervalMs` and returns the current Date (matches the web app's 200ms tick). */
export function useNow(intervalMs = 200) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
