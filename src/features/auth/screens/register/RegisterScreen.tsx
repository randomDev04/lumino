import { useButtonPressAnimation, useShakeAnimation } from "@/shared/hooks";
import {
  AppButton,
  AppText,
  AppTextInput,
  FadeSlideIn,
  ScreenWrapper,
} from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useAuthStore } from "../../store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const nameShake = useShakeAnimation();
  const emailShake = useShakeAnimation();
  const passwordShake = useShakeAnimation();
  const confirmPasswordShake = useShakeAnimation();
  const buttonPress = useButtonPressAnimation();

  // const isLoading = registerStatus === "loading";

  // ── Validation ─────────────────────────────────────────
  const validate = (): boolean => {
    let valid = true;

    if (!name.trim()) {
      setNameError("Full name is required");
      nameShake.shake();
      valid = false;
    } else {
      setNameError("");
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      emailShake.shake();
      valid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError("Enter a valid email address");
      emailShake.shake();
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      passwordShake.shake();
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      passwordShake.shake();
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      confirmPasswordShake.shake();
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      confirmPasswordShake.shake();
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    return valid;
  };

  // ── Submit ─────────────────────────────────────────────
  const handleRegister = () => {
    buttonPress.onPress(async () => {
      if (!validate()) return;

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        await register({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        router.replace("/(auth)/login");
      } catch (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        console.log("Register error:", error);
      }
    });
  };

  return (
    <ScreenWrapper
      edges={["top", "left", "right"]}
      safeArea
      statusBarStyle="dark"
    >
      <View className="flex-1 px-6 pt-5 pb-10">
        {/* ── Heading ── */}
        <FadeSlideIn delay={0}>
          <View className="items-center mb-8">
            <AppText variant="h1" className="mb-1 text-center">
              Create Account
            </AppText>
            <AppText variant="body2" className="text-gray-500 text-center px-6">
              Join Lumino and start your learning journey today
            </AppText>
          </View>
        </FadeSlideIn>

        {/* ── Form ── */}
        <FadeSlideIn delay={150}>
          {/* Name */}
          <Animated.View style={nameShake.animatedStyle}>
            <AppTextInput
              label="Full Name"
              placeholder="John Doe"
              leftIcon="person-outline"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              error={nameError}
            />
          </Animated.View>

          {/* Email */}
          <Animated.View style={emailShake.animatedStyle}>
            <AppTextInput
              label="Email Address"
              placeholder="you@example.com"
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={emailError}
            />
          </Animated.View>

          {/* Password */}
          <Animated.View style={passwordShake.animatedStyle}>
            <AppTextInput
              label="Password"
              placeholder="Min. 6 characters"
              leftIcon="lock-closed-outline"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={passwordError}
            />
          </Animated.View>

          {/* Confirm Password */}
          <Animated.View style={confirmPasswordShake.animatedStyle}>
            <AppTextInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              leftIcon="lock-closed-outline"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPasswordError}
            />
          </Animated.View>
        </FadeSlideIn>

        {/* ── CTA ── */}
        <FadeSlideIn delay={300}>
          <Animated.View style={buttonPress.animatedStyle}>
            <AppButton
              title="Create Account"
              loading={loading}
              disabled={loading}
              onPress={handleRegister}
              className="mt-2"
            />
          </Animated.View>
        </FadeSlideIn>

        {/* ── Divider ── */}
        <FadeSlideIn delay={450}>
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-200" />
            <AppText variant="caption" className="mx-4 text-gray-400">
              Already a member?
            </AppText>
            <View className="flex-1 h-px bg-gray-200" />
          </View>
        </FadeSlideIn>

        {/* ── Sign In ── */}
        <FadeSlideIn delay={550}>
          <AppButton
            title="Sign In"
            variant="outline"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace("/(auth)/login");
            }}
          />
        </FadeSlideIn>

        {/* ── Terms ── */}
        <FadeSlideIn delay={650}>
          <AppText
            variant="caption"
            className="text-gray-400 text-center mt-6 px-4"
          >
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </AppText>
        </FadeSlideIn>
      </View>
    </ScreenWrapper>
  );
}
