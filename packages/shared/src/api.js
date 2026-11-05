// Minimal client for the optional ClockBoard sync server.
// Endpoints mirror what the web app already calls; this is the seam where the
// future API's contract should live so web and mobile stay in lockstep.

/**
 * @param {{ baseUrl: string, headers?: Array<{key: string, value: string}>, fetchImpl?: typeof fetch }} opts
 */
export function createApiClient({ baseUrl, headers = [], fetchImpl = globalThis.fetch }) {
  const isConnected = !!baseUrl && baseUrl.trim() !== ''

  async function request(method, path, body) {
    if (!isConnected) return null
    const h = { 'Content-Type': 'application/json' }
    headers.forEach(({ key, value }) => {
      if (key && key.trim()) h[key.trim()] = value
    })
    const res = await fetchImpl(baseUrl.replace(/\/$/, '') + path, {
      method,
      headers: h,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`Server responded with ${res.status}`)
    const text = await res.text()
    return text ? JSON.parse(text) : null
  }

  return {
    isConnected,
    request,
    timers: {
      list: () => request('GET', '/timers'),
      create: (timer) => request('POST', '/timers', timer),
      remove: (id) => request('DELETE', `/timers/${id}`),
      pause: (id) => request('POST', `/timers/pause/${id}`),
      restart: (id) => request('POST', `/timers/restart/${id}`),
    },
    stopwatches: {
      list: () => request('GET', '/stopwatches'),
      create: (sw) => request('POST', '/stopwatches', sw),
      remove: (id) => request('DELETE', `/stopwatches/${id}`),
      pause: (id) => request('POST', `/stopwatches/pause/${id}`),
      restart: (id) => request('POST', `/stopwatches/restart/${id}`),
    },
  }
}
