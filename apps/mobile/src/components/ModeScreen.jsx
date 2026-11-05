import { Stack } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { MODES } from '../modes'
import { useSettings } from '../context/SettingsContext'
import SimpleClock from './SimpleClock'
import TimerList from './TimerList'

// Shared shell for every clock-mode route. Unported modes show the simple clock
// plus a note, so routing/navigation can be built out before the visuals.
export default function ModeScreen({ mode, children }) {
  const { themeValues } = useSettings()
  const meta = MODES.find(m => m.id === mode)

  return (
    <ScrollView style={{ backgroundColor: themeValues.primaryColor }} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: meta?.label ?? mode }} />
      <View style={styles.clock}>{children ?? <SimpleClock />}</View>
      {!meta?.ported && <Text style={styles.note}>{meta?.label} visuals not ported yet — showing the simple clock.</Text>}
      <TimerList />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 16, justifyContent: 'center' },
  clock: { marginVertical: 32 },
  note: { color: '#ccc', textAlign: 'center', marginBottom: 16, fontStyle: 'italic' },
})
