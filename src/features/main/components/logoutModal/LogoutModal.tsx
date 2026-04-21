import { AppButton, AppIcon, AppText } from "@/shared/ui";
import { Modal, Pressable, View } from "react-native";

// ─────────────────────────────────────────────────────
export const LogoutModal = ({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable onPress={onCancel} className="flex-1 bg-black/50 justify-end">
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-white rounded-t-3xl px-6 pt-4 pb-10">
            {/* Handle */}
            <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-6" />

            {/* Icon */}
            <View className="items-center mb-5">
              <View className="bg-red-100 w-16 h-16 rounded-full items-center justify-center mb-3">
                <AppIcon
                  icon={{
                    type: "expo",
                    family: "Ionicons",
                    name: "log-out-outline",
                  }}
                  size={30}
                  color="#EF4444"
                />
              </View>
              <AppText variant="h2" className="mb-1">
                Log Out?
              </AppText>
              <AppText variant="body2" className="text-gray-400 text-center">
                You'll need to sign in again to access your account.
              </AppText>
            </View>

            {/* Actions */}
            <AppButton
              title="Yes, Log Out"
              className="bg-red-500 mb-3"
              onPress={onConfirm}
            />
            <AppButton title="Cancel" variant="outline" onPress={onCancel} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
