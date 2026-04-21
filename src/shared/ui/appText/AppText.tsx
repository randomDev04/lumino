import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "../../hooks";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "body2"
  | "caption"
  | "button";

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
  className?: string;
  color?: string;
}

const formatChildren = (children: React.ReactNode): React.ReactNode => {
  // Handle null/undefined
  if (children === null || children === undefined) return "";

  // Handle primitive values
  if (typeof children === "string" || typeof children === "number") {
    return children;
  }

  // Handle arrays
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>{formatChildren(child)}</React.Fragment>
    ));
  }

  // Handle objects (prevent crash)
  if (typeof children === "object") {
    if (__DEV__) {
      console.warn("AppText received object:", children);
    }
    return JSON.stringify(children); // or return "" if you prefer silent
  }

  return children;
};

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
      {formatChildren(children)}
    </Text>
  );
};

export default AppText;
