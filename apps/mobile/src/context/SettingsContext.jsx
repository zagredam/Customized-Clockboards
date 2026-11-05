import { createContext, useContext, useEffect, useState } from 'react'
import { TEAMS, resolveTheme } from '@clockboard/shared/teams'
import { load, save } from '../storage'

const defaults = {
  theme: 'MZ',
  altTheme: true,
  showSeconds: true,
  showMeridum: true,
  showDate: true,
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all(Object.keys(defaults).map(k => load(k, defaults[k]))).then(values => {
      setSettings(Object.fromEntries(Object.keys(defaults).map((k, i) => [k, values[i]])))
      setLoaded(true)
    })
  }, [])

  const set = (key) => (value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    save(key, value)
  }

  const themeValues = resolveTheme(settings.theme, { alt: settings.altTheme })

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        loaded,
        setTheme: set('theme'),
        setAltTheme: set('altTheme'),
        setShowSeconds: set('showSeconds'),
        setShowMeridum: set('showMeridum'),
        setShowDate: set('showDate'),
        themeOptions: TEAMS,
        themeValues,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
