import { AppText, ScreenWrapper } from "@/shared/ui";
import { View } from "react-native";

export default function BookMark() {
  return (
    <ScreenWrapper safeArea>
      <View className="flex-1 items-center justify-center">
        <AppText variant="h2">Bookmark</AppText>
      </View>
    </ScreenWrapper>
  );
}
