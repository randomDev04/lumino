import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "../../hooks";

/**
 * Central Typography Variants
 * Update ONLY here ==> entire app updates
 */
export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "body2"
  | "caption"
  | "button";

/**
 * Variant ==> Tailwind mapping
 * This is your design system layer
 */
const variantStyles: Record<TextVariant, string> = {
  h1: "text-2xl font-bold",
  h2: "text-xl font-semibold",
  h3: "text-lg font-semibold",
  body: "text-base",
  body2: "text-sm",
  caption: "text-xs",
  button: "text-base font-medium",
};

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  variant?: TextVariant;

  /** Tailwind override */
  className?: string;

  /** Optional color override */
  color?: string;
}

const AppText: React.FC<AppTextProps> = ({
  children,
  variant = "body",
  className = "",
  color,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <Text
      className={`${variantStyles[variant]} ${className}`}
      style={[
        {
          color: color ?? colors.textPrimary,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;
