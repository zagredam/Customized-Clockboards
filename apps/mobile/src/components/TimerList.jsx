import { Pressable, StyleSheet, Text, View } from 'react-native'
import { formatDuration, getTimerSecondsLeft, getStopwatchElapsedSeconds } from '@clockboard/shared/timers'
import { useTimers } from '../context/TimersContext'
import { useNow } from '../hooks'

function Row({ label, value, expired, paused, onToggle, onReset, onClose }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.value, expired && styles.expired]}>{value}</Text>
        {!!label && <Text style={styles.label}>{label}</Text>}
      </View>
      <Pressable onPress={onToggle} style={styles.btn}><Text style={styles.btnText}>{paused ? '▶' : '❚❚'}</Text></Pressable>
      <Pressable onPress={onReset} style={styles.btn}><Text style={styles.btnText}>↺</Text></Pressable>
      <Pressable onPress={onClose} style={styles.btn}><Text style={styles.btnText}>✕</Text></Pressable>
    </View>
  )
}

export default function TimerList() {
  const now = useNow().getTime()
  const t = useTimers()

  return (
    <View>
      {t.timers.map(timer => {
        const left = getTimerSecondsLeft(timer, now)
        return (
          <Row
            key={`t${timer.id}`}
            label={timer.label}
            value={formatDuration(left)}
            expired={left < 0}
            paused={timer.paused}
            onToggle={() => t.toggleTimer(timer.id)}
            onReset={() => t.resetTimer(timer.id)}
            onClose={() => t.closeTimer(timer.id)}
          />
        )
      })}
      {t.stopwatches.map(sw => (
        <Row
          key={`s${sw.id}`}
          label={sw.label}
          value={formatDuration(getStopwatchElapsedSeconds(sw, now))}
          paused={sw.paused}
          onToggle={() => t.toggleStopwatch(sw.id)}
          onReset={() => t.resetStopwatch(sw.id)}
          onClose={() => t.closeStopwatch(sw.id)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#444' },
  value: { color: '#fff', fontSize: 36, fontVariant: ['tabular-nums'] },
  expired: { color: '#ff5252' },
  label: { color: '#aaa', fontSize: 14 },
  btn: { padding: 10 },
  btnText: { color: '#fff', fontSize: 20 },
})
