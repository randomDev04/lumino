import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import "../../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen
            name="courses/[id]"
            options={{
              animation: "slide_from_right",
            }}
          />
        </Stack>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
