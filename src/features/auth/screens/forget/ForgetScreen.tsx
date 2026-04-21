import { useShakeAnimation } from "@/shared/hooks";
import {
  AppButton,
  AppIcon,
  AppText,
  AppTextInput,
  FadeSlideIn,
  ScreenWrapper,
} from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { useAuthStore } from "../../store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotScreen() {
  const router = useRouter();

  const { forgotPassword, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sent, setSent] = useState(false);

  const emailShake = useShakeAnimation();

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError("Email is required");
      emailShake.shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Enter a valid email address");
      emailShake.shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await forgotPassword(email.trim());

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setSent(true);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.log("Forgot password error:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to send reset email. Please try again.",
      );
    }
  };

  return (
    <ScreenWrapper
      edges={["top", "left", "right"]}
      safeArea
      statusBarStyle="dark"
    >
      <View className="flex-1 px-6 pb-10">
        {/* ── Back Button ── */}
        <FadeSlideIn delay={0}>
          <Pressable onPress={() => router.back()}>
            <AppIcon
              icon={{
                type: "expo",
                family: "Ionicons",
                name: "arrow-back",
              }}
              size={30}
            />
          </Pressable>
        </FadeSlideIn>

        {/* ── Icon + Heading ── */}
        <FadeSlideIn delay={100}>
          <View className="items-center mt-6 mb-10">
            <View className="bg-blue-400 w-20 h-20 rounded-full items-center justify-center mb-5">
              <AppIcon
                icon={{ type: "expo", family: "Ionicons", name: "lock-closed" }}
                size={36}
                color="#fff"
              />
            </View>
            <AppText variant="h1" className="mb-2 text-center">
              Forgot Password?
            </AppText>
            <AppText variant="body2" className="text-center text-gray-500 ">
              Enter your email and we'll send you instructions to reset your
              password.
            </AppText>
          </View>
        </FadeSlideIn>

        {/* ── Success State ── */}
        {sent ? (
          <FadeSlideIn delay={0}>
            <View className="bg-green-50 border border-green-200 rounded-2xl p-5 items-center">
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: "checkmark-circle",
                }}
                size={40}
                color="#22C55E"
              />
              <AppText
                variant="h3"
                className="text-green-700 mt-3 mb-1 text-center"
              >
                Email Sent!
              </AppText>
              <AppText variant="body2" className="text-green-600 text-center">
                Check your inbox for reset instructions. Don't forget to check
                your spam folder.
              </AppText>
              <AppButton
                title="Back to Login"
                className="mt-6 w-full"
                onPress={() => router.back()}
              />
            </View>
          </FadeSlideIn>
        ) : (
          <>
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
            </FadeSlideIn>

            {/* ── Submit ── */}
            <FadeSlideIn delay={300}>
              <AppButton
                title="Send Reset Link"
                loading={loading}
                disabled={loading}
                onPress={handleSubmit}
              />
            </FadeSlideIn>

            {/* ── Info Card ── */}
            <FadeSlideIn delay={400}>
              <View className="flex-row items-start bg-orange-50 border border-orange-100 rounded-2xl p-4 mt-6">
                <AppIcon
                  icon={{
                    type: "expo",
                    family: "Ionicons",
                    name: "information-circle",
                  }}
                  size={22}
                  color="#44a5ff"
                />
                <View className="flex-1 ml-3">
                  <AppText
                    variant="body2"
                    className="font-semibold text-gray-700 mb-1"
                  >
                    Check your spam folder
                  </AppText>
                  <AppText variant="caption" className="text-gray-500">
                    If an account exists with this email, you'll receive reset
                    instructions shortly.
                  </AppText>
                </View>
              </View>
            </FadeSlideIn>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}
