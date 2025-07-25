// app/_layout.tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* The tab group lives in the (tabs) folder */}
        <Stack.Screen name="(tabs)" />
        {/* Keep the template modal for now */}
        <Stack.Screen name="+modal" />
      </Stack>
    </GestureHandlerRootView>
  );
}
