import { useTheme } from "@/shared/hooks";
import {
  AppButton,
  AppTextInput as AppInput,
  AppText,
  ScreenWrapper,
} from "@/shared/ui";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // TODO: wire up useAuth hook when slice is ready
  const handleLogin = () => {};

  return (
    <ScreenWrapper avoidKeyboard dismissKeyboardOnTap statusBarStyle="dark">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-12 pb-10">
          {/* ── Brand ─────────────────────────────── */}
          <View className="flex-row items-center gap-3 mb-10">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <AppText variant="h3" color="#fff">
                L
              </AppText>
            </View>
            <View>
              <AppText variant="h3" className="tracking-tight">
                Lumio
              </AppText>
              <AppText variant="caption" color={colors.textMuted}>
                Learn without limits
              </AppText>
            </View>
          </View>

          {/* ── Eyebrow tag ─────────────────────── */}
          <View
            className="self-start flex-row items-center gap-2 px-3 py-1 rounded-lg mb-3"
            style={{ backgroundColor: "#FFF0ED" }}
          >
            <View
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <AppText
              variant="caption"
              color="#C84B2F"
              className="font-semibold"
            >
              Sign in
            </AppText>
          </View>

          {/* ── Heading ─────────────────────────── */}
          <AppText variant="h1" className="mb-2 tracking-tight leading-tight">
            Welcome{"\n"}back.
          </AppText>
          <AppText
            variant="body2"
            color={colors.textSecondary}
            className="mb-6"
          >
            Pick up right where you left off.
          </AppText>

          {/* ── Accent divider ─────────────────── */}
          <View
            className="w-8 h-1 rounded-full mb-7"
            style={{ backgroundColor: colors.primary }}
          />

          {/* ── Form ────────────────────────────── */}
          <AppInput
            label="Email"
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon="mail-outline"
            variant="outline"
            value={email}
            onChangeText={setEmail}
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoComplete="password"
            leftIcon="lock-closed-outline"
            rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
            onRightPress={() => setShowPassword((p) => !p)}
            variant="outline"
            value={password}
            onChangeText={setPassword}
          />

          {/* ── Forgot password ─────────────────── */}
          <Pressable
            className="items-end mb-6 -mt-2"
            // onPress={() => router.push("/auth/forgot-password")}
            hitSlop={{ top: 8, bottom: 8 }}
          >
            <AppText
              variant="body2"
              color={colors.primary}
              className="font-semibold"
            >
              Forgot password?
            </AppText>
          </Pressable>

          {/* ── Login button ─────────────────────── */}
          <AppButton
            title="Continue"
            variant="primary"
            onPress={handleLogin}
            className="mb-5"
          />

          {/* ── Divider ──────────────────────────── */}
          <View className="flex-row items-center gap-3 mb-5">
            <View className="flex-1 h-px bg-gray-200" />
            <AppText variant="caption" color={colors.textMuted}>
              or
            </AppText>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* ── Google button ───────────────────── */}
          <AppButton
            title="Continue with Google"
            variant="outline"
            onPress={() => {}}
            className="mb-8"
          />

          {/* ── Sign up link ─────────────────────── */}
          <View className="flex-row justify-center items-center">
            <AppText variant="body2" color={colors.textMuted}>
              New to Lumio?{" "}
            </AppText>
            <Pressable
              // onPress={() => router.push("/auth/register")}
              hitSlop={{ top: 8, bottom: 8 }}
            >
              <AppText
                variant="body2"
                color={colors.primary}
                className="font-bold"
              >
                Create account
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
