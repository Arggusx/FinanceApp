// app/_layout.js
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Bem-vindo', headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="registro" options={{ title: 'Registro' }} />
      <Stack.Screen name="home" options={{ title: 'Home', headerShown: false }} />
    </Stack>
  );
}