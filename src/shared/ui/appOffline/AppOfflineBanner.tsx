import { useNetworkStore } from "@/shared/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";
import Animated, {
    SlideInDown,
    SlideOutUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const OfflineBanner = () => {
  const isOffline = useNetworkStore((s) => s.isOffline);

  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(1);

  const [visible, setVisible] = useState(false);
  const [isOnlineMessage, setIsOnlineMessage] = useState(false);

  const prevOffline = useRef(isOffline);

  useEffect(() => {
    // OFFLINE → ONLINE
    if (prevOffline.current && !isOffline) {
      setIsOnlineMessage(true);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        setIsOnlineMessage(false);
      }, 2000);

      return () => clearTimeout(timer);
    }

    // ONLINE → OFFLINE
    if (!prevOffline.current && isOffline) {
      setIsOnlineMessage(false);
      setVisible(true);

      opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 800 }),
          withTiming(1, { duration: 800 }),
        ),
        -1,
        false,
      );
    }

    // reset animation when online
    if (!isOffline) {
      opacity.value = 1;
    }

    prevOffline.current = isOffline;
  }, [isOffline]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const topPadding =
    insets.top > 0 ? insets.top + 8 : Platform.OS === "ios" ? 50 : 10;

  return (
    <Animated.View
      entering={SlideInDown.springify()}
      exiting={SlideOutUp}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingTop: topPadding,
      }}
    >
      <View
        className={`${
          isOnlineMessage ? "bg-green-500" : "bg-amber-500"
        } mx-3 rounded-2xl overflow-hidden`}
      >
        <View className="flex-row items-center px-4 py-3">
          <View className="bg-white/20 rounded-full p-2 mr-3">
            <Ionicons
              name={
                isOnlineMessage
                  ? "checkmark-circle-outline"
                  : "cloud-offline-outline"
              }
              size={20}
              color="white"
            />
          </View>

          <View className="flex-1">
            <Text className="text-white font-bold text-sm">
              {isOnlineMessage ? "Back Online" : "No Internet Connection"}
            </Text>
            <Text className="text-white/80 text-xs mt-0.5">
              {isOnlineMessage
                ? "Connection restored"
                : "Check your connection"}
            </Text>
          </View>

          {!isOnlineMessage && (
            <Animated.View
              style={[dotStyle]}
              className="w-2 h-2 rounded-full bg-white"
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
};
