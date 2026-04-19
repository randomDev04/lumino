import {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from "react-native-reanimated";

export function useButtonPressAnimation() {
  const scale = useSharedValue(1);

  const onPress = (callback: () => void) => {
    scale.value = withSequence(withSpring(0.95), withSpring(1));
    callback();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { onPress, animatedStyle };
}
