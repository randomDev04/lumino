import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

interface FadeSlideInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

const FadeSlideIn: React.FC<FadeSlideInProps> = ({
  children,
  delay = 0,
  duration = 600,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(duration)}>
    {children}
  </Animated.View>
);

export default FadeSlideIn;
