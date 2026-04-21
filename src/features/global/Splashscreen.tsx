import { AppText } from "@/shared/ui";
import { ActivityIndicator, View } from "react-native";

export function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <AppText variant="h1" className="mb-4">
        Lumio
      </AppText>

      <ActivityIndicator size="large" />

      <AppText className="mt-4 text-gray-500">Loading...</AppText>
    </View>
  );
}
