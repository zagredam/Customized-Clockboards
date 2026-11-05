import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SettingsProvider, useSettings } from '../context/SettingsContext'
import { TimersProvider } from '../context/TimersContext'

function ThemedStack() {
  const { themeValues } = useSettings()
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: themeValues.primaryColor },
        headerTintColor: themeValues.secondaryColor,
        contentStyle: { backgroundColor: '#111' },
      }}
    />
  )
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <TimersProvider>
        <StatusBar style="light" />
        <ThemedStack />
      </TimersProvider>
    </SettingsProvider>
  )
}
