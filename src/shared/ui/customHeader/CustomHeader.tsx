import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppIcon from "../appIcon/AppIcon";
import AppText from "../appText/AppText";

const HEADER_GRADIENT: readonly [string, string, ...string[]] = [
  "#FF6444",
  "#FF9A85",
];

// ── Standalone props — no navigator dependency ─────────
interface CustomHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  transparent?: boolean;
  showTitle?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
  showTitle = true,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();
  const iconColor = transparent ? "#1a1a1a" : "#ffffff";

  const content = (
    <View className="h-14 flex-row items-center px-4">
      {/* Left */}
      <View className="w-10">
        {showBack && onBack && (
          <Pressable onPress={onBack} hitSlop={8}>
            <AppIcon
              icon={{ type: "expo", family: "Ionicons", name: "chevron-back" }}
              size={24}
              color={iconColor}
            />
          </Pressable>
        )}
      </View>

      {/* Center */}
      {showTitle && title && (
        <View className="flex-1">
          <AppText variant="h3" color={transparent ? "#1a1a1a" : "#ffffff"}>
            {title}
          </AppText>
        </View>
      )}

      {/* Right */}
      <View className="w-10 items-end">
        {rightIcon && onRightPress && (
          <Pressable onPress={onRightPress} hitSlop={8}>
            <AppIcon
              icon={{ type: "expo", family: "Ionicons", name: rightIcon }}
              size={22}
              color={iconColor}
            />
          </Pressable>
        )}
      </View>
    </View>
  );

  if (transparent) {
    return (
      <View style={{ paddingTop: insets.top }} className="bg-transparent">
        {content}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={HEADER_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ paddingTop: insets.top }}
    >
      {content}
    </LinearGradient>
  );
};

export default CustomHeader;
