// Measures how far the device clock is from a reference time server.
// `fetchImpl` and `nowImpl` are injectable so this runs in browsers, React Native and tests.

export const DEFAULT_TIME_URL = 'https://worldtimeapi.org/api/timezone/Etc/UTC'

export async function measureClockDrift({
  url = DEFAULT_TIME_URL,
  fetchImpl = globalThis.fetch,
  nowImpl = () => Date.now(),
  perfNow = () => (globalThis.performance?.now ? globalThis.performance.now() : Date.now()),
} = {}) {
  const deviceTime = nowImpl()
  const requestStart = perfNow()
  const response = await fetchImpl(url)
  const requestEnd = perfNow()
  const data = await response.json()

  const roundTripLatency = requestEnd - requestStart
  const estimatedLatency = roundTripLatency / 2
  const serverTime = new Date(data.datetime).getTime()
  const adjustedServerTime = serverTime - estimatedLatency
  const driftMs = deviceTime - adjustedServerTime

  return {
    browserTime: deviceTime,
    serverTime,
    adjustedServerTime,
    networkLatencyMs: estimatedLatency.toFixed(2),
    roundTripLatencyMs: roundTripLatency.toFixed(2),
    driftMs,
    driftSeconds: (driftMs / 1000).toFixed(2),
    driftMinutes: (driftMs / 1000 / 60).toFixed(2),
    isSlow: driftMs < 0,
    isAhead: driftMs > 0,
    isAccurate: Math.abs(driftMs) < 500, // within 500ms
  }
}
