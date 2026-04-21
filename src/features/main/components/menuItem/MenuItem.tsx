import { AppIcon, AppText, FadeSlideIn } from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  badge?: number | null;
  isLast?: boolean;
  delay?: number;
  onPress: () => void;
}

export function MenuItem({
  icon,
  title,
  subtitle,
  badge,
  isLast,
  delay = 0,
  onPress,
}: Props) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <FadeSlideIn delay={delay}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <Animated.View
          style={style}
          className={`flex-row items-center px-4 py-3.5 ${
            !isLast ? "border-b border-gray-100" : ""
          }`}
        >
          <View className="bg-gray-100 p-2.5 rounded-2xl mr-4">
            <AppIcon
              icon={{ type: "expo", family: "Ionicons", name: icon as any }}
              size={20}
              color="#6B7280"
            />
          </View>

          <View className="flex-1">
            <AppText variant="body2" className="font-semibold">
              {title}
            </AppText>
            <AppText variant="caption" className="text-gray-400">
              {subtitle}
            </AppText>
          </View>

          {badge != null && badge > 0 && (
            <View className="bg-blue-500 px-2 py-0.5 rounded-full mr-2">
              <AppText variant="caption" color="#fff">
                {badge}
              </AppText>
            </View>
          )}

          <AppIcon
            icon={{ type: "expo", family: "Ionicons", name: "chevron-forward" }}
            size={18}
            color="#D1D5DB"
          />
        </Animated.View>
      </Pressable>
    </FadeSlideIn>
  );
}
