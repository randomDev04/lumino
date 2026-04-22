import { useAuthStore } from "@/features/auth";
import { AppIcon, AppText, FadeSlideIn, ScreenWrapper } from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogoutModal, MenuItem, ProfileCard } from "../../components";
import { useCourseStore } from "../../store/useCourseStore";
import {
  ProfileMenuItem,
  ProfileStats,
  ProfileUser,
} from "../../types/profile.types";

// ─────────────────────────────────────────────────────
// AvatarModal
// ─────────────────────────────────────────────────────
function AvatarModal({
  visible,
  avatarUri,
  onClose,
}: {
  visible: boolean;
  avatarUri: string;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/90 items-center justify-center"
      >
        <Animated.View entering={FadeInDown.springify()}>
          <Image
            source={{ uri: avatarUri }}
            style={{ width: 280, height: 280, borderRadius: 140 }}
            resizeMode="cover"
          />
          <AppText variant="caption" className="text-gray-400 text-center mt-4">
            Tap anywhere to close
          </AppText>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────
// ProfileScreen
// ─────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const authUser = useAuthStore((s) => s.user);
  const { bookmarkedCourses, enrolledCourses } = useCourseStore();
  const clearSession = useAuthStore((s) => s.clearSession);
  const resetCourses = useCourseStore((s) => s.reset);

  const [showLogout, setShowLogout] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  console.log(authUser?.avatar?.url);

  const user: ProfileUser = {
    name: authUser?.username || "User",
    email: authUser?.email || "",
    username: authUser?.username || "",
    role: authUser?.role || "Student",

    avatar:
      authUser?.avatar?.url && authUser.avatar.url.trim() !== ""
        ? authUser.avatar.url
        : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,

    joinedDate: "Recently",
  };

  const stats: ProfileStats = {
    enrolled: 12,
    bookmarks: 8,
    completed: 5,
    progress: 72,
  };

  const menuItems: ProfileMenuItem[] = [
    {
      key: "edit-profile",
      icon: "person-outline",
      title: "Edit Profile",
      subtitle: "Update your details",
      route: "profile/edit-profile",
    },
    {
      key: "bookings",
      icon: "school-outline",
      title: "My Courses",
      subtitle: "View your sessions",
      route: "profile/enrolled",
      badge: enrolledCourses.length,
    },
    {
      key: "saved",
      icon: "bookmark-outline",
      title: "My Bookmarks",
      subtitle: "Your favorites",
      route: "profile/bookmark",
      badge: bookmarkedCourses.length,
    },
    {
      key: "notifications",
      icon: "settings-outline",
      title: "Settings",
      subtitle: "App preferences",
      route: "profile/settings",
      badge: 3,
    },
  ];

  const handleLogout = () => {
    // swap with real store action when ready
    clearSession();
    resetCourses();
    setShowLogout(false);
  };

  return (
    <ScreenWrapper safeArea={false} statusBarStyle="dark">
      {/* ── Fixed Header ── */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="bg-blue-400 px-5 pb-4 border-b border-gray-100"
      >
        <View className="flex-row items-center justify-between">
          <AppText variant="h2">Profile</AppText>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowLogout(true);
            }}
            className="bg-gray-100 p-2 rounded-full"
            hitSlop={6}
          >
            <AppIcon
              icon={{
                type: "expo",
                family: "Ionicons",
                name: "log-out-outline",
              }}
              size={22}
              color="#1F2937"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View className="px-5 pt-5">
          {/* ── Profile Card ── */}
          <ProfileCard
            user={user}
            stats={stats}
            onAvatarPress={() => {
              console.log("Open avatar modal");
            }}
          />
          {/* ── Progress Bar Card ── */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="bg-white rounded-3xl p-5 mb-5 shadow-sm"
          >
            <View className="flex-row items-center justify-between mb-3">
              <AppText variant="body2" className="font-semibold">
                Overall Progress
              </AppText>
              <AppText variant="caption" className="text-blue-500 font-bold">
                {stats.progress}%
              </AppText>
            </View>

            {/* Track */}
            <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <Animated.View
                entering={FadeInRight.delay(400).duration(800)}
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${stats.progress}%` }}
              />
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <AppText variant="caption" className="text-gray-400">
                {stats.completed} of {stats.enrolled} courses completed
              </AppText>
              <AppText variant="caption" className="text-gray-400">
                🎯 Keep going!
              </AppText>
            </View>
          </Animated.View>

          {/* ── Menu Items ── */}

          <View className="mt-6 bg-white rounded-3xl shadow-sm">
            {menuItems.map((item, index) => (
              <MenuItem
                key={item.key}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                badge={item.badge}
                isLast={item.isLast || index === menuItems.length - 1}
                delay={index * 50}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  }
                }}
              />
            ))}
          </View>

          {/* ── Logout Button ── */}
          <FadeSlideIn delay={700} duration={500}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowLogout(true);
              }}
              className="bg-red-50 border border-red-100 rounded-2xl p-4 flex-row items-center justify-center gap-2 mt-10"
            >
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: "log-out-outline",
                }}
                size={20}
                color="#EF4444"
              />
              <AppText
                variant="body2"
                color="#EF4444"
                className="font-semibold"
              >
                Log Out
              </AppText>
            </Pressable>
          </FadeSlideIn>

          {/* ── App Version ── */}
          <FadeSlideIn delay={800} duration={500}>
            <AppText
              variant="caption"
              className="text-gray-300 text-center mt-5"
            >
              Lumino v1.0.0
            </AppText>
          </FadeSlideIn>
        </View>
      </ScrollView>

      {/* ── Modals ── */}
      <LogoutModal
        visible={showLogout}
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
      />

      <AvatarModal
        visible={showAvatar}
        avatarUri={user.avatar}
        onClose={() => setShowAvatar(false)}
      />
    </ScreenWrapper>
  );
}
