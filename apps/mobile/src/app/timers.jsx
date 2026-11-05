import { Stack } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useTimers } from '../context/TimersContext'
import { useSettings } from '../context/SettingsContext'
import TimerList from '../components/TimerList'

// Same presets as the web app's settings panel.
const PRESETS = [
  { label: '20s', minutes: '', seconds: '20' },
  { label: '5m', minutes: '5', seconds: '' },
  { label: '25m', minutes: '25', seconds: '' },
  { label: '1h', minutes: '60', seconds: '' },
]

export default function Timers() {
  const { addTimer, addStopwatch } = useTimers()
  const { themeValues } = useSettings()
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [label, setLabel] = useState('')
  const accent = { backgroundColor: themeValues.primaryColor }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Timers' }} />
      <View style={styles.inputs}>
        <TextInput style={styles.input} placeholder="Min" placeholderTextColor="#888" keyboardType="number-pad" value={minutes} onChangeText={setMinutes} />
        <TextInput style={styles.input} placeholder="Sec" placeholderTextColor="#888" keyboardType="number-pad" value={seconds} onChangeText={setSeconds} />
        <TextInput style={[styles.input, { flex: 2 }]} placeholder="Label" placeholderTextColor="#888" value={label} onChangeText={setLabel} />
      </View>
      <View style={styles.buttons}>
        <Pressable style={[styles.btn, accent]} onPress={() => { addTimer(minutes, seconds, label); setMinutes(''); setSeconds('') }}>
          <Text style={styles.btnText}>Add timer</Text>
        </Pressable>
        <Pressable style={[styles.btn, accent]} onPress={() => addStopwatch(label)}>
          <Text style={styles.btnText}>Add stopwatch</Text>
        </Pressable>
      </View>
      <View style={styles.buttons}>
        {PRESETS.map(p => (
          <Pressable key={p.label} style={[styles.btn, styles.preset]} onPress={() => addTimer(p.minutes, p.seconds, label)}>
            <Text style={styles.btnText}>{p.label}</Text>
          </Pressable>
        ))}
      </View>
      <TimerList />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  inputs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: { flex: 1, backgroundColor: '#222', color: '#fff', borderRadius: 8, padding: 12, fontSize: 18 },
  buttons: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  btn: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  preset: { backgroundColor: '#333' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
