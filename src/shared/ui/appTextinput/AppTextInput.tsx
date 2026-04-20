import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import AppText from "../appText/AppText";

type InputVariant = "default" | "outline" | "ghost";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  variant?: InputVariant;
  containerClassName?: string;
}

const variantStyles: Record<InputVariant, string> = {
  default: "bg-gray-100",
  outline: "border border-gray-300 bg-white",
  ghost: "bg-transparent border-b border-gray-300 rounded-none",
};

const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightPress,
  variant = "default",
  containerClassName = "",
  secureTextEntry,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry === true;

  const resolvedRightIcon: keyof typeof Ionicons.glyphMap | undefined =
    isPassword ? (showPassword ? "eye-outline" : "eye-off-outline") : rightIcon;

  const handleRightPress = isPassword
    ? () => setShowPassword((prev) => !prev)
    : onRightPress;

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <AppText variant="h3" className="mb-1">
          {label}
        </AppText>
      )}

      {/* Input Wrapper */}
      <View
        className={`
          flex-row items-center rounded-xl px-3
          ${variantStyles[variant]}
          ${error ? "border-red-500" : focused ? "border-orange-500" : ""}
        `}
      >
        {/* Left Icon */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color="#888"
            style={{ marginRight: 8 }}
          />
        )}

        {/* Input */}
        <TextInput
          className="flex-1 py-3 text-base text-black"
          placeholderTextColor="#999"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={isPassword ? !showPassword : false}
          {...props}
        />

        {/* Right Icon */}
        {resolvedRightIcon && (
          <Pressable onPress={handleRightPress} hitSlop={8}>
            <Ionicons name={resolvedRightIcon} size={18} color="#888" />
          </Pressable>
        )}
      </View>

      {/* Error */}
      {error && (
        <AppText variant="caption" className="mt-1" style={{ color: "red" }}>
          {error}
        </AppText>
      )}
    </View>
  );
};

export default AppInput;
