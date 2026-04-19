// TODO (LMS Core):
// - Add gradient background support
// - Add loading overlay support
// - Add offline state wrapper
// - Add error boundary integration

import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    Keyboard,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../hooks";

interface ScreenWrapperProps {
  children: React.ReactNode;

  safeArea?: boolean;
  backgroundColor?: string;

  statusBarHidden?: boolean;
  dismissKeyboardOnTap?: boolean;
  avoidKeyboard?: boolean;

  edges?: Edge[];

  statusBarStyle?: "light" | "dark" | "auto";

  /** Tailwind override */
  className?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  safeArea = true,
  backgroundColor,
  statusBarHidden,
  dismissKeyboardOnTap,
  avoidKeyboard,
  edges,
  statusBarStyle,
  className = "",
}) => {
  const scheme = useColorScheme();
  const { colors } = useTheme();

  const finalBg = backgroundColor ?? colors.background;

  const resolvedBarStyle =
    statusBarStyle ?? (scheme === "dark" ? "light" : "dark");

  // ── Base content ─────────────────────────
  const content = safeArea ? (
    <SafeAreaView edges={edges} className={`flex-1 ${className}`}>
      {children}
    </SafeAreaView>
  ) : (
    <View className={`flex-1 ${className}`}>{children}</View>
  );

  // ── Keyboard handling ────────────────────
  const keyboardWrapped = avoidKeyboard ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={5}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  // ── Dismiss keyboard ─────────────────────
  const interactiveContent = dismissKeyboardOnTap ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {keyboardWrapped}
    </TouchableWithoutFeedback>
  ) : (
    keyboardWrapped
  );

  return (
    <View style={{ flex: 1, backgroundColor: finalBg }}>
      <StatusBar
        translucent
        style={resolvedBarStyle}
        hidden={statusBarHidden}
      />
      {interactiveContent}
    </View>
  );
};

export default ScreenWrapper;
