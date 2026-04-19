import { ROUTES } from "@/core";
import { useButtonPressAnimation, useShakeAnimation } from "@/shared/hooks";
import {
  AppButton,
  AppText,
  AppTextInput,
  FadeSlideIn,
  ScreenWrapper,
} from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailShake = useShakeAnimation();
  const passwordShake = useShakeAnimation();
  const buttonPress = useButtonPressAnimation();

  // const isLoading = status === "loading";

  const validate = (): boolean => {
    let valid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      emailShake.shake();
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      passwordShake.shake();
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    return valid;
  };

  const handleLogin = () => {
    buttonPress.onPress(async () => {
      if (!validate()) return;

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // await login({ email, password });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Navigation is handled by your root navigator watching auth state
        // Don't navigate manually here — let Redux/auth state drive it
      } catch {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        // Errors shown via toast in authSlice — no local state needed
      }
    });
  };

  return (
    <ScreenWrapper
      edges={["top", "left", "right"]}
      avoidKeyboard
      dismissKeyboardOnTap
      safeArea
      statusBarStyle="auto"
    >
      <View className="flex-1 px-6 pb-8">
        {/* ── Logo + Heading ── */}
        <FadeSlideIn delay={0}>
          <View className="items-center mb-10 mt-4">
            <AppText variant="h1" className="mb-1">
              Welcome Back 👋
            </AppText>
            <AppText
              variant="body2"
              className="text-gray-500 text-center px-10"
            >
              Sign in to your Lumio account
            </AppText>
          </View>
        </FadeSlideIn>

        {/* ── Form ── */}
        <FadeSlideIn delay={200}>
          <Animated.View style={emailShake.animatedStyle}>
            <AppTextInput
              label="Email Address"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              value={email}
              onChangeText={setEmail}
              error={emailError}
            />
          </Animated.View>

          <Animated.View style={passwordShake.animatedStyle}>
            <AppTextInput
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              leftIcon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
            />
          </Animated.View>

          {/* Forgot Password */}
          <View className="items-end -mt-2 mb-6">
            <AppText
              variant="caption"
              className="text-orange-500 font-semibold"
              onPress={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
            >
              Forgot Password?
            </AppText>
          </View>
        </FadeSlideIn>

        {/* ── CTA ── */}
        <FadeSlideIn delay={400}>
          <Animated.View style={buttonPress.animatedStyle}>
            <AppButton
              title="Sign In"
              // loading={isLoading}
              // disabled={isLoading}
              onPress={handleLogin}
            />
          </Animated.View>
        </FadeSlideIn>

        {/* ── Divider ── */}
        <FadeSlideIn delay={600}>
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-200" />
            <AppText variant="caption" className="mx-4 text-gray-400">
              Don't have an account?
            </AppText>
            <View className="flex-1 h-px bg-gray-200" />
          </View>
        </FadeSlideIn>

        {/* ── Register ── */}
        <FadeSlideIn delay={800}>
          <AppButton
            title="Create Account"
            variant="outline"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(ROUTES.AUTH.REGISTER);
            }}
          />
        </FadeSlideIn>
      </View>
    </ScreenWrapper>
  );
}
