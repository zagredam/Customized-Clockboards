import { Link, Stack } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { MODES } from '../modes'
import { useSettings } from '../context/SettingsContext'

export default function Home() {
  const { themeValues } = useSettings()
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'ClockBoard' }} />
      <Text style={styles.heading}>Clock modes</Text>
      <View style={styles.grid}>
        {MODES.map(m => (
          <Link key={m.id} href={`/${m.id}`} asChild>
            <Pressable style={[styles.tile, { borderColor: themeValues.secondaryColor }]}>
              <Text style={styles.icon}>{m.icon}</Text>
              <Text style={styles.tileText}>{m.label}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
      <Link href="/timers" asChild>
        <Pressable style={[styles.wide, { backgroundColor: themeValues.primaryColor }]}>
          <Text style={[styles.tileText, { color: themeValues.secondaryColor }]}>Timers & Stopwatches</Text>
        </Pressable>
      </Link>
      <Link href="/settings" asChild>
        <Pressable style={[styles.wide, { backgroundColor: '#333' }]}>
          <Text style={styles.tileText}>Settings</Text>
        </Pressable>
      </Link>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  heading: { color: '#fff', fontSize: 22, fontWeight: '600', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  tile: { width: '47%', aspectRatio: 1.4, borderWidth: 2, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 32, marginBottom: 6 },
  tileText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  wide: { padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
})
