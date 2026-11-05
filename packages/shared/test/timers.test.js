import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseTimerDuration, createTimer, toggleTimer, resetTimer, getTimerSecondsLeft,
  createStopwatch, toggleStopwatch, getStopwatchElapsedSeconds, formatDuration, nextId,
  resolveTheme, createApiClient,
} from '../src/index.js'

test('parseTimerDuration', () => {
  assert.equal(parseTimerDuration('5', ''), 300000)
  assert.equal(parseTimerDuration('', '20'), 20000)
  assert.equal(parseTimerDuration('', ''), null)
  assert.equal(parseTimerDuration('x', '1'), null)
})

test('timer pause/resume keeps remaining time', () => {
  let t = createTimer({ id: 1, label: 'a', timerValue: 60000, now: 0 })
  assert.equal(getTimerSecondsLeft(t, 10000), 50)
  t = toggleTimer(t, 10000)            // pause with 50s left
  assert.equal(getTimerSecondsLeft(t, 99999), 50)
  t = toggleTimer(t, 100000)           // resume
  assert.equal(getTimerSecondsLeft(t, 110000), 40)
  t = resetTimer(t, 200000)
  assert.equal(getTimerSecondsLeft(t, 200000), 60)
})

test('stopwatch accumulates across pauses', () => {
  let sw = createStopwatch({ id: 2, label: 'b', now: 0 })
  sw = toggleStopwatch(sw, 5000)       // pause at 5s
  assert.equal(getStopwatchElapsedSeconds(sw, 50000), 5)
  sw = toggleStopwatch(sw, 60000)      // resume
  assert.equal(getStopwatchElapsedSeconds(sw, 63000), 8)
})

test('formatDuration', () => {
  assert.equal(formatDuration(9), '00:09')
  assert.equal(formatDuration(3909), '1:05:09')
  assert.equal(formatDuration(-3), '00:00')
})

test('nextId', () => {
  assert.equal(nextId([], []), 0)
  assert.equal(nextId([{ id: 3 }], [{ id: 7 }]), 8)
})

test('resolveTheme swaps colors for alt', () => {
  const t = resolveTheme('MZ', { alt: true })
  assert.equal(t.primaryColor, '#c7924c')
  assert.equal(t.secondaryColor, '#005A43')
})

test('api client builds requests', async () => {
  const calls = []
  const api = createApiClient({
    baseUrl: 'http://x/',
    headers: [{ key: 'Auth', value: 'k' }, { key: ' ', value: 'ignored' }],
    fetchImpl: async (url, init) => { calls.push([url, init]); return { ok: true, text: async () => '{"id":5}' } },
  })
  assert.deepEqual(await api.timers.create({ a: 1 }), { id: 5 })
  assert.equal(calls[0][0], 'http://x/timers')
  assert.equal(calls[0][1].headers.Auth, 'k')
  assert.equal(createApiClient({ baseUrl: '' }).isConnected, false)
})
