import { IconName, icons } from "@/assets";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

// ─── Types ─────────────────────────────────────────────

type LocalIcon = {
  type: "local";
  name: IconName;
};

type ExpoIcon = {
  type: "expo";
  family: "Ionicons" | "MaterialIcons" | "Feather" | "FontAwesome6";
  name: string;
};

export type AppIconSource = LocalIcon | ExpoIcon;

type AppIconProps = {
  icon: AppIconSource;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

// ─── Lazy loader (IMPORTANT) ───────────────────────────

const getExpoIcon = (family: ExpoIcon["family"]) => {
  switch (family) {
    case "Ionicons":
      return require("@expo/vector-icons/Ionicons").default;
    case "MaterialIcons":
      return require("@expo/vector-icons/MaterialIcons").default;
    case "Feather":
      return require("@expo/vector-icons/Feather").default;
    case "FontAwesome6":
      return require("@expo/vector-icons/FontAwesome6").default;
    default:
      return require("@expo/vector-icons/Ionicons").default;
  }
};

// ─── Component ─────────────────────────────────────────

const AppIcon: React.FC<AppIconProps> = ({
  icon,
  size = 24,
  color = "#000",
  style,
}) => {
  // ── Local SVG ─────────────────────────────
  if (icon.type === "local") {
    const SvgIcon = icons[icon.name];

    if (!SvgIcon) return null;

    return (
      <SvgIcon
        width={size}
        height={size}
        fill={color}
        stroke={color}
        style={style}
      />
    );
  }

  // ── Expo Icon ────────────────────────────
  const ExpoIcon = getExpoIcon(icon.family);

  return <ExpoIcon name={icon.name} size={size} color={color} style={style} />;
};

export default AppIcon;
