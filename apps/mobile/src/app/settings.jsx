import { Stack } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { useSettings } from '../context/SettingsContext'

export default function Settings() {
  const s = useSettings()
  const toggles = [
    ['Show seconds', s.showSeconds, s.setShowSeconds],
    ['Show AM/PM', s.showMeridum, s.setShowMeridum],
    ['Show date', s.showDate, s.setShowDate],
    ['Swap theme colors', s.altTheme, s.setAltTheme],
  ]

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Settings' }} />
      {toggles.map(([label, value, setter]) => (
        <View key={label} style={styles.toggle}>
          <Text style={styles.text}>{label}</Text>
          <Switch value={value} onValueChange={setter} />
        </View>
      ))}
      <Text style={styles.heading}>Theme</Text>
      {s.themeOptions.map(t => (
        <Pressable key={t.id} onPress={() => s.setTheme(t.id)} style={[styles.theme, s.theme === t.id && styles.selected]}>
          <View style={[styles.swatch, { backgroundColor: t.primaryColor }]} />
          <View style={[styles.swatch, { backgroundColor: t.secondaryColor }]} />
          <Text style={styles.text}>{t.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  toggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  heading: { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  theme: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8 },
  selected: { backgroundColor: '#333' },
  swatch: { width: 22, height: 22, borderRadius: 4, marginRight: 6, borderWidth: 1, borderColor: '#555' },
  text: { color: '#fff', fontSize: 16, marginLeft: 4 },
})
