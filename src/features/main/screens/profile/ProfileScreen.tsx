import { AppButton, AppIcon, AppText, ScreenWrapper } from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Mock Data ──────────────────────────────────────────
const MOCK_USER = {
  name: "Arjun Mehta",
  email: "arjun.mehta@gmail.com",
  username: "arjunmehta",
  role: "Student",
  avatar: "https://i.pravatar.cc/300?img=12",
  joinedDate: "January 2024",
};

const MOCK_STATS = {
  enrolled: 7,
  bookmarks: 14,
  completed: 3,
  progress: 42,
};

const MOCK_MENU = [
  {
    key: "edit",
    icon: "person-outline",
    title: "Edit Profile",
    subtitle: "Update your information",
    route: "/settings/edit-profile",
    badge: null,
  },
  {
    key: "courses",
    icon: "school-outline",
    title: "My Courses",
    subtitle: `${MOCK_STATS.enrolled} enrolled`,
    route: "/enrolled",
    badge: MOCK_STATS.enrolled,
  },
  {
    key: "bookmarks",
    icon: "bookmark-outline",
    title: "Bookmarks",
    subtitle: `${MOCK_STATS.bookmarks} saved`,
    route: null,
    badge: MOCK_STATS.bookmarks,
  },
  {
    key: "certificates",
    icon: "ribbon-outline",
    title: "Certificates",
    subtitle: `${MOCK_STATS.completed} earned`,
    route: "/certificates",
    badge: MOCK_STATS.completed,
  },
  {
    key: "settings",
    icon: "settings-outline",
    title: "Settings",
    subtitle: "App preferences",
    route: "/settings",
    badge: null,
  },
  {
    key: "help",
    icon: "help-circle-outline",
    title: "Help & Support",
    subtitle: "Get assistance",
    route: null,
    badge: null,
    isLast: true,
  },
];

// ─────────────────────────────────────────────────────
// StatItem
// ─────────────────────────────────────────────────────
function StatItem({
  icon,
  value,
  label,
  color,
  delay,
}: {
  icon: string;
  value: string | number;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500)}
      className="items-center flex-1"
    >
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
      <AppText variant="h3" className="mb-0.5">
        {value}
      </AppText>
      <AppText variant="caption" className="text-gray-400">
        {label}
      </AppText>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────
// MenuItem
// ─────────────────────────────────────────────────────
function MenuItem({
  icon,
  title,
  subtitle,
  badge,
  isLast,
  delay,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  badge?: number | null;
  isLast?: boolean;
  delay: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInRight.delay(delay).duration(500)}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
      >
        <Animated.View
          style={animatedStyle}
          className={`flex-row items-center px-4 py-3.5 ${
            !isLast ? "border-b border-gray-100" : ""
          }`}
        >
          {/* Icon */}
          <View className="bg-gray-100 p-2.5 rounded-2xl mr-4">
            <AppIcon
              icon={{ type: "expo", family: "Ionicons", name: icon as any }}
              size={20}
              color="#6B7280"
            />
          </View>

          {/* Text */}
          <View className="flex-1">
            <AppText variant="body2" className="font-semibold mb-0.5">
              {title}
            </AppText>
            <AppText variant="caption" className="text-gray-400">
              {subtitle}
            </AppText>
          </View>

          {/* Badge + Chevron */}
          <View className="flex-row items-center gap-2">
            {badge != null && badge > 0 && (
              <View className="bg-blue-500 px-2 py-0.5 rounded-full">
                <AppText variant="caption" color="#fff" className="font-bold">
                  {badge}
                </AppText>
              </View>
            )}
            <AppIcon
              icon={{
                type: "expo",
                family: "Ionicons",
                name: "chevron-forward",
              }}
              size={18}
              color="#D1D5DB"
            />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────
// LogoutModal
// ─────────────────────────────────────────────────────
function LogoutModal({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
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
}

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

  const [showLogout, setShowLogout] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  const handleLogout = () => {
    // swap with real store action when ready
    setShowLogout(false);
    router.replace("/(auth)/login");
  };

  return (
    <ScreenWrapper safeArea={false} statusBarStyle="dark">
      {/* ── Fixed Header ── */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="bg-white px-5 pb-4 border-b border-gray-100"
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
          <Animated.View
            entering={FadeInDown.delay(0).duration(500)}
            className="bg-white rounded-3xl p-5 mb-5 shadow-sm"
          >
            {/* Avatar + Info */}
            <View className="flex-row items-center mb-5">
              {/* Avatar */}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowAvatar(true);
                }}
              >
                <View className="relative">
                  <Image
                    source={{ uri: MOCK_USER.avatar }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                    resizeMode="cover"
                  />
                  {/* Camera badge */}
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      // wire ImagePicker when ready
                    }}
                    className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full"
                  >
                    <AppIcon
                      icon={{
                        type: "expo",
                        family: "Ionicons",
                        name: "camera",
                      }}
                      size={13}
                      color="#fff"
                    />
                  </Pressable>
                </View>
              </Pressable>

              {/* Info */}
              <View className="flex-1 ml-4">
                <AppText variant="h3" className="mb-0.5">
                  {MOCK_USER.name}
                </AppText>
                <AppText variant="caption" className="text-gray-400 mb-2">
                  {MOCK_USER.email}
                </AppText>
                <View className="flex-row items-center gap-2">
                  <View className="bg-blue-500 px-3 py-1 rounded-full">
                    <AppText
                      variant="caption"
                      color="#fff"
                      className="font-semibold"
                    >
                      {MOCK_USER.role}
                    </AppText>
                  </View>
                  <View className="bg-gray-100 px-3 py-1 rounded-full">
                    <AppText variant="caption" className="text-gray-500">
                      Since {MOCK_USER.joinedDate}
                    </AppText>
                  </View>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-100 mb-5" />

            {/* Stats */}
            <View className="flex-row">
              <StatItem
                icon="school-outline"
                value={MOCK_STATS.enrolled}
                label="Enrolled"
                color="#3B82F6"
                delay={150}
              />
              <StatItem
                icon="checkmark-circle-outline"
                value={MOCK_STATS.completed}
                label="Completed"
                color="#10B981"
                delay={200}
              />
              <StatItem
                icon="bookmark-outline"
                value={MOCK_STATS.bookmarks}
                label="Saved"
                color="#8B5CF6"
                delay={250}
              />
              <StatItem
                icon="trending-up-outline"
                value={`${MOCK_STATS.progress}%`}
                label="Progress"
                color="#F59E0B"
                delay={300}
              />
            </View>
          </Animated.View>

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
                {MOCK_STATS.progress}%
              </AppText>
            </View>

            {/* Track */}
            <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <Animated.View
                entering={FadeInRight.delay(400).duration(800)}
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${MOCK_STATS.progress}%` }}
              />
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <AppText variant="caption" className="text-gray-400">
                {MOCK_STATS.completed} of {MOCK_STATS.enrolled} courses
                completed
              </AppText>
              <AppText variant="caption" className="text-gray-400">
                🎯 Keep going!
              </AppText>
            </View>
          </Animated.View>

          {/* ── Menu Items ── */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            className="bg-white rounded-3xl overflow-hidden shadow-sm mb-5"
          >
            {MOCK_MENU.map((item, index) => (
              <MenuItem
                key={item.key}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                badge={item.badge}
                isLast={item.isLast}
                delay={350 + index * 60}
                onPress={() => {
                  if (item.route) router.push(item.route as any);
                }}
              />
            ))}
          </Animated.View>

          {/* ── Logout Button ── */}
          <Animated.View entering={FadeInDown.delay(700).duration(500)}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowLogout(true);
              }}
              className="bg-red-50 border border-red-100 rounded-2xl p-4 flex-row items-center justify-center gap-2"
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
          </Animated.View>

          {/* ── App Version ── */}
          <Animated.View entering={FadeInDown.delay(800).duration(500)}>
            <AppText
              variant="caption"
              className="text-gray-300 text-center mt-5"
            >
              Learnexia v1.0.0
            </AppText>
          </Animated.View>
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
        avatarUri={MOCK_USER.avatar}
        onClose={() => setShowAvatar(false)}
      />
    </ScreenWrapper>
  );
}
