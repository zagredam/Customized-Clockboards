import { createContext, useContext, useState } from 'react'
import { createApiClient } from '@clockboard/shared/api'

const ServerContext = createContext(null)

function loadStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val !== null ? JSON.parse(val) : fallback
  } catch { return fallback }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function ServerProvider({ children }) {
  const [serverUrl, setServerUrlRaw] = useState(() => loadStorage('cb_serverUrl', ''))
  const [serverHeaders, setServerHeadersRaw] = useState(() => loadStorage('cb_serverHeaders', []))
  // serverHeaders: [{ key: string, value: string }]

  const isConnected = serverUrl.trim() !== ''

  const setServerUrl = (v) => { setServerUrlRaw(v); saveStorage('cb_serverUrl', v) }
  const setServerHeaders = (v) => { setServerHeadersRaw(v); saveStorage('cb_serverHeaders', v) }

  const serverRequest = createApiClient({ baseUrl: serverUrl, headers: serverHeaders }).request

  return (
    <ServerContext.Provider value={{
      serverUrl, setServerUrl,
      serverHeaders, setServerHeaders,
      isConnected,
      serverRequest,
    }}>
      {children}
    </ServerContext.Provider>
  )
}

export function useServerContext() {
  return useContext(ServerContext)
}
