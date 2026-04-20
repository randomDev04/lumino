import { AppText, ScreenWrapper } from "@/shared/ui";
import { View } from "react-native";

export default function Enrolled() {
  return (
    <ScreenWrapper safeArea>
      <View className="flex-1 items-center justify-center">
        <AppText variant="h2">Enrolled</AppText>
      </View>
    </ScreenWrapper>
  );
}
