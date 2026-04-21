import { AppIcon, AppText } from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, View } from "react-native";

const SORT_OPTIONS = [
  { key: "default", label: "Default", icon: "apps-outline" },
  { key: "title", label: "Title (A–Z)", icon: "text-outline" },
  { key: "rating", label: "Rating (High–Low)", icon: "star-outline" },
  { key: "price", label: "Price (Low–High)", icon: "cash-outline" },
  { key: "students", label: "Most Popular", icon: "people-outline" },
];

interface SortSheetProps {
  visible: boolean;
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────
export const SortSheet: React.FC<SortSheetProps> = ({
  visible,
  selected,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/50 justify-end">
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-white rounded-t-3xl px-6 pt-4 pb-10">
            <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-5" />

            <View className="flex-row items-center justify-between mb-5">
              <AppText variant="h2">Sort By</AppText>
              <Pressable onPress={onClose} hitSlop={8}>
                <AppIcon
                  icon={{ type: "expo", family: "Ionicons", name: "close" }}
                  size={24}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>

            {SORT_OPTIONS.map((opt) => {
              const isActive = selected === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onSelect(opt.key);
                    onClose();
                  }}
                  className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${
                    isActive ? "bg-blue-500" : "bg-gray-100"
                  }`}
                >
                  <View className="flex-row items-center">
                    <AppIcon
                      icon={{
                        type: "expo",
                        family: "Ionicons",
                        name: opt.icon as any,
                      }}
                      size={20}
                      color={isActive ? "#fff" : "#6B7280"}
                    />
                    <AppText
                      variant="body"
                      className="ml-3 font-semibold"
                      color={isActive ? "#fff" : undefined}
                    >
                      {opt.label}
                    </AppText>
                  </View>
                  {isActive && (
                    <AppIcon
                      icon={{
                        type: "expo",
                        family: "Ionicons",
                        name: "checkmark",
                      }}
                      size={20}
                      color="#fff"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
