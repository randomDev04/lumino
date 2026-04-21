import { AppIcon, AppText } from "@/shared/ui";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Tab Config ─────────────────────────────────────────
type TabConfig = {
  name: string;
  label: string;
  icon: string;
  iconActive: string;
};

const TABS: TabConfig[] = [
  {
    name: "index",
    label: "Home",
    icon: "home-outline",
    iconActive: "home",
  },
  {
    name: "profile",
    label: "Profile",
    icon: "person-outline",
    iconActive: "person",
  },
];

// ── Tab Item ───────────────────────────────────────────
function TabItem({
  tab,
  isFocused,
  onPress,
}: {
  tab: TabConfig;
  isFocused: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.85, {}, () => {
      scale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-1 items-center justify-center"
      hitSlop={4}
    >
      <Animated.View style={animatedStyle} className="items-center">
        {/* Active Pill Background */}
        {isFocused && (
          <View className="absolute -top-1 w-12 h-1 bg-blue-500 rounded-full" />
        )}

        {/* Icon Container */}
        <View
          className={`w-12 h-8 items-center justify-center rounded-2xl mb-0.5 ${
            isFocused ? "bg-blue-50" : "bg-transparent"
          }`}
        >
          <AppIcon
            icon={{
              type: "expo",
              family: "Ionicons",
              name: (isFocused ? tab.iconActive : tab.icon) as any,
            }}
            size={22}
            color={isFocused ? "#3B82F6" : "#9CA3AF"}
          />
        </View>

        {/* Label */}
        <AppText
          variant="caption"
          className="font-semibold"
          color={isFocused ? "#3B82F6" : "#9CA3AF"}
        >
          {tab.label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

// ── Custom Tab Bar ─────────────────────────────────────
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-white border-t border-gray-100 pt-2"
      // Shadow
      style={{
        paddingBottom: insets.bottom || 8,
        paddingTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 12,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
      }}
    >
      {TABS.map((tab, index) => (
        <TabItem
          key={tab.name}
          tab={tab}
          isFocused={state.index === index}
          onPress={() => {
            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[index]?.key ?? "",
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          }}
        />
      ))}
    </View>
  );
}

// ── Layout ─────────────────────────────────────────────
export default function MainLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
