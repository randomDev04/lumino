import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export const SkeletonBox = ({
  style,
  isDark,
}: {
  style?: any;
  isDark: boolean;
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View
      style={[
        style,
        {
          backgroundColor: isDark ? "#374151" : "#E5E7EB",
          overflow: "hidden",
        },
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: [{ translateX }],
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.4)",
        }}
      />
    </View>
  );
};
