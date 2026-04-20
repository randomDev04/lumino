import { AppText, ScreenWrapper } from "@/shared/ui";
import { View } from "react-native";

export default function EditProfile() {
  return (
    <ScreenWrapper safeArea>
      <View className="flex-1 items-center justify-center">
        <AppText variant="h2">EditProfile</AppText>
      </View>
    </ScreenWrapper>
  );
}
