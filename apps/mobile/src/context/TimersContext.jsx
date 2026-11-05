import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  parseTimerDuration, createTimer, resetTimer, toggleTimer,
  createStopwatch, resetStopwatch, toggleStopwatch, nextId,
} from '@clockboard/shared/timers'
import { load, save } from '../storage'

// Local-only for now. When the API lands, wire `createApiClient` from
// @clockboard/shared/api in here the same way the web AppContext does.
const TimersContext = createContext(null)

export function TimersProvider({ children }) {
  const [timers, setTimers] = useState([])
  const [stopwatches, setStopwatches] = useState([])
  const loaded = useRef(false)
  const idRef = useRef(0)

  useEffect(() => {
    Promise.all([load('timers', []), load('stopwatches', [])]).then(([t, sw]) => {
      setTimers(t)
      setStopwatches(sw)
      idRef.current = nextId(t, sw)
      loaded.current = true
    })
  }, [])

  useEffect(() => { if (loaded.current) save('timers', timers) }, [timers])
  useEffect(() => { if (loaded.current) save('stopwatches', stopwatches) }, [stopwatches])

  const update = (setter, fn) => (id) => setter(prev => prev.map(x => (x.id === id ? fn(x) : x)))
  const remove = (setter) => (id) => setter(prev => prev.filter(x => x.id !== id))

  const addTimer = useCallback((minutes, seconds, label = '') => {
    const timerValue = parseTimerDuration(minutes, seconds)
    if (timerValue === null) return
    setTimers(prev => [...prev, createTimer({ id: idRef.current++, label, timerValue })])
  }, [])

  const addStopwatch = useCallback((label = '') => {
    setStopwatches(prev => [...prev, createStopwatch({ id: idRef.current++, label })])
  }, [])

  return (
    <TimersContext.Provider
      value={{
        timers, stopwatches,
        addTimer,
        closeTimer: remove(setTimers),
        resetTimer: update(setTimers, t => resetTimer(t)),
        toggleTimer: update(setTimers, t => toggleTimer(t)),
        addStopwatch,
        closeStopwatch: remove(setStopwatches),
        resetStopwatch: update(setStopwatches, sw => resetStopwatch(sw)),
        toggleStopwatch: update(setStopwatches, sw => toggleStopwatch(sw)),
      }}
    >
      {children}
    </TimersContext.Provider>
  )
}

export const useTimers = () => useContext(TimersContext)
