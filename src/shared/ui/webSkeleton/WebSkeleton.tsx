import React, { memo, useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const SkeletonBlock = memo(
  ({
    opacity,
    className,
  }: {
    opacity: Animated.AnimatedInterpolation<number>;
    className: string;
  }) => {
    return <Animated.View style={{ opacity }} className={className} />;
  },
);

SkeletonBlock.displayName = "SkeletonBlock";

export const WebViewSkeleton: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop(); // prevent memory leak
    };
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.75],
  });

  const bgColor = isDark ? "bg-gray-700" : "bg-gray-200";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"} p-5`}>
      <View className={`${cardBg} rounded-3xl p-6 shadow-lg`}>
        {/* Header */}
        <View className="items-center mb-6 pb-5 border-b border-gray-300">
          <SkeletonBlock
            opacity={opacity}
            className={`${bgColor} h-8 w-3/4 rounded-lg mb-3`}
          />
          <SkeletonBlock
            opacity={opacity}
            className={`${bgColor} h-6 w-24 rounded-full`}
          />
        </View>

        {/* Instructor */}
        <View
          className={`flex-row items-center ${
            isDark ? "bg-gray-700" : "bg-gray-100"
          } p-4 rounded-2xl mb-6`}
        >
          <SkeletonBlock
            opacity={opacity}
            className={`${bgColor} w-16 h-16 rounded-full mr-4`}
          />
          <View className="flex-1">
            <SkeletonBlock
              opacity={opacity}
              className={`${bgColor} h-4 w-32 rounded mb-2`}
            />
            <SkeletonBlock
              opacity={opacity}
              className={`${bgColor} h-3 w-24 rounded`}
            />
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around mb-6">
          {[1, 2, 3].map((i) => (
            <View key={i} className="items-center">
              <SkeletonBlock
                opacity={opacity}
                className={`${bgColor} w-16 h-16 rounded-full mb-2`}
              />
              <SkeletonBlock
                opacity={opacity}
                className={`${bgColor} h-4 w-12 rounded mb-1`}
              />
              <SkeletonBlock
                opacity={opacity}
                className={`${bgColor} h-3 w-16 rounded`}
              />
            </View>
          ))}
        </View>

        {/* Content */}
        <View className="mb-6">
          <SkeletonBlock
            opacity={opacity}
            className={`${bgColor} h-6 w-40 rounded mb-3`}
          />
          <SkeletonBlock
            opacity={opacity}
            className={`${bgColor} h-4 w-full rounded mb-2`}
          />
          <SkeletonBlock
            opacity={opacity}
            className={`${bgColor} h-4 w-full rounded mb-2`}
          />
          <SkeletonBlock
            opacity={opacity}
            className={`${bgColor} h-4 w-3/4 rounded`}
          />
        </View>

        {/* Lessons */}
        <View className="mb-6">
          <SkeletonBlock
            opacity={opacity}
            className={`${bgColor} h-6 w-48 rounded mb-3`}
          />
          {[1, 2, 3].map((i) => (
            <SkeletonBlock
              key={i}
              opacity={opacity}
              className={`${bgColor} h-16 w-full rounded-xl mb-2`}
            />
          ))}
        </View>

        {/* Price */}
        <SkeletonBlock
          opacity={opacity}
          className={`${bgColor} h-20 w-full rounded-2xl`}
        />
      </View>
    </View>
  );
};
