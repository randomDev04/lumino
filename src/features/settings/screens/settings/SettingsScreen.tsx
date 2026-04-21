// app/(main)/profile/settings.tsx  (or wherever your settings route lives)

import {
  AppIcon,
  AppText,
  CustomHeader,
  FadeSlideIn,
  ScreenWrapper,
} from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Types ──────────────────────────────────────────────
type Settings = {
  allNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoDownload: boolean;
  reduceData: boolean;
  offlineMode: boolean;
  darkMode: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  allNotifications: true,
  emailNotifications: true,
  pushNotifications: true,
  autoDownload: false,
  reduceData: true,
  offlineMode: false,
  darkMode: false,
};

// ─────────────────────────────────────────────────────
// AnimatedSwitch
// ─────────────────────────────────────────────────────
function AnimatedSwitch({
  value,
  onToggle,
  color = "#3B82F6",
  disabled = false,
}: {
  value: boolean;
  onToggle: () => void;
  color?: string;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(withSpring(0.85), withSpring(1));
    onToggle();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Switch
        value={value}
        onValueChange={handlePress}
        trackColor={{ false: "#E5E7EB", true: color + "80" }}
        thumbColor={value ? color : "#F9FAFB"}
        disabled={disabled}
      />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────
// SectionHeader
// ─────────────────────────────────────────────────────
function SectionHeader({
  icon,
  label,
  color,
  bg,
}: {
  icon: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100">
      <View className="p-2.5 rounded-2xl mr-3" style={{ backgroundColor: bg }}>
        <AppIcon
          icon={{ type: "expo", family: "Ionicons", name: icon as any }}
          size={22}
          color={color}
        />
      </View>
      <AppText variant="h3">{label}</AppText>
    </View>
  );
}

// ─────────────────────────────────────────────────────
// ToggleRow
// ─────────────────────────────────────────────────────
function ToggleRow({
  title,
  subtitle,
  value,
  onToggle,
  color,
  disabled,
  isLast,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  color?: string;
  disabled?: boolean;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-3.5 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      <View className="flex-1 mr-4">
        <AppText
          variant="body2"
          className="font-semibold mb-0.5"
          color={disabled ? "#9CA3AF" : undefined}
        >
          {title}
        </AppText>
        <AppText variant="caption" className="text-gray-400">
          {subtitle}
        </AppText>
      </View>
      <AnimatedSwitch
        value={value}
        onToggle={onToggle}
        color={color}
        disabled={disabled}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────
// InfoRow
// ─────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-3.5 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      <AppText variant="body2" className="text-gray-400">
        {label}
      </AppText>
      <AppText variant="body2" className="font-semibold">
        {value}
      </AppText>
    </View>
  );
}

// ─────────────────────────────────────────────────────
// DangerRow
// ─────────────────────────────────────────────────────
function DangerRow({
  icon,
  iconBg,
  iconColor,
  borderColor,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View
        style={[animatedStyle, { borderColor, borderWidth: 1.5 }]}
        className="flex-row items-center bg-white rounded-2xl p-4 mb-3"
      >
        <View
          className="p-2.5 rounded-2xl mr-4"
          style={{ backgroundColor: iconBg }}
        >
          <AppIcon
            icon={{ type: "expo", family: "Ionicons", name: icon as any }}
            size={22}
            color={iconColor}
          />
        </View>

        <View className="flex-1">
          <AppText variant="body2" className="font-semibold mb-0.5">
            {title}
          </AppText>
          <AppText variant="caption" className="text-gray-400">
            {subtitle}
          </AppText>
        </View>

        <AppIcon
          icon={{ type: "expo", family: "Ionicons", name: "chevron-forward" }}
          size={18}
          color="#D1D5DB"
        />
      </Animated.View>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────
// SettingsScreen
// ─────────────────────────────────────────────────────
function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const toggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearCache = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // wire real logic later
  };

  const handleResetSettings = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <ScreenWrapper safeArea={false} statusBarStyle="dark">
      {/* ── Header ── */}
      <CustomHeader title="Settings" showBack onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View className="px-5 pt-5 gap-4">
          {/* ── Notifications ── */}
          <FadeSlideIn delay={0} duration={400}>
            <SectionHeader
              icon="notifications-outline"
              label="Notifications"
              color="#3B82F6"
              bg="#DBEAFE"
            />
            <ToggleRow
              title="All Notifications"
              subtitle="Master toggle for all alerts"
              value={settings.allNotifications}
              onToggle={() => toggle("allNotifications")}
              color="#3B82F6"
            />
            <ToggleRow
              title="Email Notifications"
              subtitle="Receive updates via email"
              value={settings.emailNotifications}
              onToggle={() => toggle("emailNotifications")}
              color="#3B82F6"
              disabled={!settings.allNotifications}
            />
            <ToggleRow
              title="Push Notifications"
              subtitle="Alerts sent to your device"
              value={settings.pushNotifications}
              onToggle={() => toggle("pushNotifications")}
              color="#3B82F6"
              disabled={!settings.allNotifications}
              isLast
            />
          </FadeSlideIn>

          {/* ── Appearance ── */}
          <FadeSlideIn delay={100} duration={400}>
            <SectionHeader
              icon="color-palette-outline"
              label="Appearance"
              color="#8B5CF6"
              bg="#EDE9FE"
            />
            <ToggleRow
              title={settings.darkMode ? "Dark Mode" : "Light Mode"}
              subtitle={
                settings.darkMode ? "Using dark theme" : "Using light theme"
              }
              value={settings.darkMode}
              onToggle={() => toggle("darkMode")}
              color="#8B5CF6"
              isLast
            />
          </FadeSlideIn>

          {/* ── Data & Storage ── */}
          <FadeSlideIn delay={200} duration={400}>
            <SectionHeader
              icon="server-outline"
              label="Data & Storage"
              color="#10B981"
              bg="#D1FAE5"
            />
            <ToggleRow
              title="Auto Download"
              subtitle="Download course content automatically"
              value={settings.autoDownload}
              onToggle={() => toggle("autoDownload")}
              color="#10B981"
            />
            <ToggleRow
              title="Reduce Data Usage"
              subtitle="Use less mobile data while streaming"
              value={settings.reduceData}
              onToggle={() => toggle("reduceData")}
              color="#10B981"
            />
            <ToggleRow
              title="Offline Mode"
              subtitle="Access downloaded content offline"
              value={settings.offlineMode}
              onToggle={() => toggle("offlineMode")}
              color="#10B981"
              isLast
            />
          </FadeSlideIn>

          {/* ── App Info ── */}
          <FadeSlideIn delay={300} duration={400}>
            <SectionHeader
              icon="information-circle-outline"
              label="App Information"
              color="#F97316"
              bg="#FFEDD5"
            />
            <InfoRow label="Version" value="1.0.0" />
            <InfoRow label="Build" value="100" />
            <InfoRow
              label="Last Updated"
              value={new Date().toLocaleDateString()}
              isLast
            />
          </FadeSlideIn>

          {/* ── Danger Zone ── */}
          <FadeSlideIn delay={400} duration={400}>
            {/* Label */}
            <View className="flex-row items-center gap-2 mb-3 px-1">
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: "warning-outline",
                }}
                size={16}
                color="#EF4444"
              />
              <AppText
                variant="caption"
                color="#EF4444"
                className="font-bold tracking-widest"
              >
                DANGER ZONE
              </AppText>
            </View>

            <DangerRow
              icon="trash-outline"
              iconBg="#FEF9C3"
              iconColor="#F59E0B"
              borderColor="#FDE68A"
              title="Clear Cache"
              subtitle="Free up storage space"
              onPress={handleClearCache}
            />
            <DangerRow
              icon="refresh-outline"
              iconBg="#FEE2E2"
              iconColor="#EF4444"
              borderColor="#FECACA"
              title="Reset Settings"
              subtitle="Restore all defaults"
              onPress={handleResetSettings}
            />
          </FadeSlideIn>

          {/* ── Version Footer ── */}
          <AppText variant="caption" className="text-gray-300 text-center pb-4">
            Learnexia © 2024 — All rights reserved
          </AppText>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

export default SettingsScreen;
