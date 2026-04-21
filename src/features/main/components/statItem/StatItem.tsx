import { AppIcon, AppText, FadeSlideIn } from "@/shared/ui";
import { View } from "react-native";

interface Props {
  icon: string;
  value: string | number;
  label: string;
  color: string;
  delay?: number;
}

export function StatItem({ icon, value, label, color, delay = 0 }: Props) {
  return (
    <FadeSlideIn delay={500}>
      <View className="items-center flex-1">
        <View
          className="w-10 h-10 rounded-2xl items-center justify-center mb-1"
          style={{ backgroundColor: color + "20" }}
        >
          <AppIcon
            icon={{ type: "expo", family: "Ionicons", name: icon as any }}
            size={20}
            color={color}
          />
        </View>

        <AppText variant="h3">{value}</AppText>

        <AppText variant="caption" className="text-gray-400">
          {label}
        </AppText>
      </View>
    </FadeSlideIn>
  );
}
