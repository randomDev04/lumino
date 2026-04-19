import { Ionicons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../appText/AppText";

interface CustomHeaderProps extends NativeStackHeaderProps {
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  transparent?: boolean;
  showTitle?: boolean;
}

const HEADER_GRADIENT: readonly [string, string, ...string[]] = [
  "#FF6444",
  "#FF9A85",
];

const CustomHeader: React.FC<CustomHeaderProps> = ({
  navigation,
  route,
  options,
  back,
  rightIcon,
  onRightPress,
  showTitle = true,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();

  const title = options.title ?? route.name;

  const iconColor = transparent ? "#1a1a1a" : "#ffffff";

  if (transparent) {
    return (
      <View style={{ paddingTop: insets.top }} className="bg-transparent">
        <View className="h-14 flex-row items-center px-4">
          {/* Left */}
          <View className="w-10">
            {back && (
              <Pressable onPress={navigation.goBack}>
                <Ionicons name="chevron-back" size={24} color={iconColor} />
              </Pressable>
            )}
          </View>

          {/* Center */}
          {showTitle && (
            <View className="flex-1">
              <AppText variant="h3" className="text-black">
                {title}
              </AppText>
            </View>
          )}

          {/* Right */}
          <View className="w-10 items-end">
            {rightIcon && onRightPress && (
              <Pressable onPress={onRightPress}>
                <Ionicons name={rightIcon} size={22} color={iconColor} />
              </Pressable>
            )}
          </View>
        </View>
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
      <View className="h-14 flex-row items-center px-4">
        {/* Left */}
        <View className="w-10">
          {back && (
            <Pressable onPress={navigation.goBack}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </Pressable>
          )}
        </View>

        {/* Center */}
        {showTitle && (
          <View className="flex-1">
            <AppText variant="h3" className="text-white">
              {title}
            </AppText>
          </View>
        )}

        {/* Right */}
        <View className="w-10 items-end">
          {rightIcon && onRightPress && (
            <Pressable onPress={onRightPress}>
              <Ionicons name={rightIcon} size={22} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default CustomHeader;
