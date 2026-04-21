import { useAuthStore } from "@/features/auth";
import { SplashScreen as RNSpash } from "@/features/global";
import { useCourseStore } from "@/features/main/store/useCourseStore";
import { useNotifications } from "@/shared/hooks/useNotifications";
import { OfflineBanner } from "@/shared/ui";
import { NetworkMonitor } from "@/shared/utils";
import { Redirect, Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import "../../global.css";

export default function RootLayout() {
  const token = useAuthStore((s) => s.token);
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);

  const hydrateCourses = useCourseStore((s) => s.hydrateLocal);
  const fetchCourses = useCourseStore((s) => s.fetchCourses);

  const segments = useSegments();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (hydrated) {
      hydrateCourses();
      fetchCourses();
    }
  }, [hydrated]);

  useEffect(() => {
    NetworkMonitor.start();
    return () => NetworkMonitor.stop();
  }, []);

  useNotifications();

  if (!hydrated) {
    return <RNSpash />;
  }

  const inAuthGroup = segments[0] === "(auth)";

  if (!token && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  if (token && inAuthGroup) {
    return <Redirect href="/(main)" />;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <OfflineBanner />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen
            name="courses/[id]"
            options={{ animation: "slide_from_right" }}
          />
        </Stack>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
