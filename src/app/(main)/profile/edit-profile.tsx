import { useAuthStore } from "@/features/auth";
import { useTheme } from "@/shared/hooks";
import {
  AppButton,
  AppIcon,
  AppText,
  AppTextInput,
  CustomHeader,
  FadeSlideIn,
  ScreenWrapper,
} from "@/shared/ui";
import { pickImages } from "@/shared/utils";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, View } from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const { isDark } = useTheme();
  const {
    user,
    updateUser,
    uploadAvatar,
    loading: authLoading,
  } = useAuthStore();

  // State
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pickImage = async () => {
    try {
      // We call the utility directly with single-selection settings
      const result = await pickImages({
        multiple: false,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      // Your utility returns result.assets[0] if multiple is false
      if (result && !Array.isArray(result)) {
        setLocalImage(result.uri);

        // Haptic feedback for a "physical" feel
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      // Note: Permissions are already handled by your utility's Alert
    }
  };

  const handleSave = async () => {
    try {
      const isChanged =
        form.username !== user?.username ||
        form.email !== user?.email ||
        localImage;

      if (!isChanged) return;

      setLoading(true);

      if (localImage) {
        await uploadAvatar(localImage);
      }

      await updateUser({
        username: form.username.trim(),
        email: form.email.trim(),
      });

      setLocalImage(null);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSuccess(true);
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.log("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper safeArea={false} dismissKeyboardOnTap avoidKeyboard>
      {/* Header */}
      <CustomHeader
        title="Edit Profile"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Avatar Section */}
        <FadeSlideIn delay={100}>
          <View className="items-center mb-8">
            <View className="relative">
              <View className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden bg-gray-200">
                <Image
                  source={{
                    uri:
                      localImage ||
                      user?.avatar?.url ||
                      user?.avatar?.localUri ||
                      `https://ui-avatars.com/api/?name=${user?.username || "User"}`,
                  }}
                  className="w-full h-full"
                />
              </View>
              <Pressable
                onPress={pickImage}
                className="absolute bottom-0 right-0 bg-blue-400 p-3 rounded-full shadow-lg border-2 border-white"
              >
                <AppIcon
                  icon={{
                    type: "expo",
                    name: "camera",
                    family: "Ionicons",
                  }}
                  size={24}
                  color="white"
                />
              </Pressable>
            </View>
            <AppText variant="caption" className="mt-4 text-gray-500">
              Tap the camera to update photo
            </AppText>
          </View>
        </FadeSlideIn>

        {/* Form Section */}
        <FadeSlideIn delay={300}>
          <View
            className={`p-6 rounded-3xl ${isDark ? "bg-gray-800" : "bg-white shadow-sm"}`}
          >
            <AppTextInput
              label="Username"
              placeholder="Enter username"
              leftIcon="person-outline"
              value={form.username}
              onChangeText={(t) => setForm({ ...form, username: t })}
            />

            <AppTextInput
              label="Email Address"
              placeholder="Enter email"
              leftIcon="mail-outline"
              value={form.email}
              editable={false} // Typically email is read-only in profile edit
              containerClassName="opacity-60"
            />

            <View className="mb-2">
              <AppText variant="h3" className="mb-1">
                Account Role
              </AppText>
              <View
                className={`flex-row items-center p-4 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <AppIcon
                  icon={{
                    type: "expo",
                    name: "shield-checkmark",
                    family: "Ionicons",
                  }}
                  size={18}
                  color="#44a5ff"
                />

                <AppText className="ml-3 font-medium">
                  {user?.role || "Student"}
                </AppText>
              </View>
            </View>
          </View>
        </FadeSlideIn>

        {/* Action Buttons */}
        <FadeSlideIn delay={500}>
          <View className="mt-8">
            <AppButton
              title="Save Changes"
              loading={loading || authLoading}
              onPress={handleSave}
            />
            <AppButton
              title="Cancel"
              variant="ghost"
              onPress={() => router.back()}
              className="mt-2"
            />
          </View>
        </FadeSlideIn>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View
            className={`${isDark ? "bg-gray-800" : "bg-white"} p-8 rounded-3xl w-full items-center`}
          >
            <View className="bg-green-100 p-4 rounded-full mb-4">
              <AppIcon
                icon={{
                  type: "expo",
                  name: "checkmark-circle",
                  family: "Ionicons",
                }}
                size={50}
                color="#10B981"
              />
            </View>
            <AppText variant="h2">Profile Updated</AppText>
            <AppText
              variant="body2"
              className="text-gray-500 text-center mt-2 mb-6"
            >
              Your profile information has been successfully saved.
            </AppText>
            <AppButton
              title="Back to Profile"
              className="w-full"
              onPress={() => {
                setShowSuccess(false);
                router.back();
              }}
            />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
