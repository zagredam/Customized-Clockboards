import { StyleSheet, Text, View } from 'react-native'
import { formatLongDate, getClockParts, pad2 } from '@clockboard/shared/time'
import { useSettings } from '../context/SettingsContext'
import { useNow } from '../hooks'

export default function SimpleClock() {
  const { showSeconds, showMeridum, showDate, themeValues } = useSettings()
  const now = useNow()
  const { hours12, minutes, seconds, meridiem } = getClockParts(now)

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={[styles.time, { color: themeValues.secondaryColor }]} adjustsFontSizeToFit numberOfLines={1}>
          {hours12}:{pad2(minutes)}
          {showSeconds && <Text style={styles.seconds}>:{pad2(seconds)}</Text>}
        </Text>
        {showMeridum && <Text style={[styles.meridiem, { color: themeValues.secondaryColor }]}>{meridiem}</Text>}
      </View>
      {showDate && <Text style={styles.date}>{formatLongDate(now)}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  time: { fontSize: 96, fontWeight: '700', fontVariant: ['tabular-nums'] },
  seconds: { fontSize: 48 },
  meridiem: { fontSize: 28, marginLeft: 8, marginBottom: 18 },
  date: { color: '#ddd', fontSize: 20, marginTop: 8 },
})
