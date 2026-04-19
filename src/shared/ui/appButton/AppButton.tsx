import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface AppButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
  gradient?: readonly [string, string, ...string[]];
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-orange-500",
  secondary: "bg-gray-200",
  outline: "border border-gray-300 bg-transparent",
  ghost: "bg-transparent",
};

const textStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-black",
  outline: "text-black",
  ghost: "text-black",
};

const spinnerColor: Record<ButtonVariant, string> = {
  primary: "#fff",
  secondary: "#111827",
  outline: "#111827",
  ghost: "#111827",
};

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
  gradient,
}) => {
  const isDisabled = disabled || loading;

  const inner = loading ? (
    <ActivityIndicator color={spinnerColor[variant]} />
  ) : (
    <Text className={`text-base font-medium ${textStyles[variant]}`}>
      {title}
    </Text>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        h-12 rounded-xl items-center justify-center
        ${variantStyles[variant]}
        ${isDisabled ? "opacity-50" : "active:opacity-70"}
        ${className}
      `}
    >
      {gradient ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {inner}
        </LinearGradient>
      ) : (
        <View
        // className={`flex-1 items-center justify-center ${variantStyles[variant]}`}
        >
          {inner}
        </View>
      )}
    </Pressable>
  );
};

export default AppButton;
