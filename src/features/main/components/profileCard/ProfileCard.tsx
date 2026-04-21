// features/profile/components/ProfileCard.tsx

import { AppText } from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { Image, Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ProfileStats, ProfileUser } from "../../types/profile.types";
import { StatItem } from "../statItem/StatItem";

interface Props {
  user: ProfileUser;
  stats: ProfileStats;
  onAvatarPress: () => void;
}

export function ProfileCard({ user, stats, onAvatarPress }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      className="bg-white rounded-3xl p-5 shadow-sm"
    >
      <View className="flex-row items-center mb-5">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onAvatarPress();
          }}
        >
          <Image
            source={{ uri: user.avatar }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
        </Pressable>

        <View className="flex-1 ml-4">
          <AppText variant="h3">{user.name}</AppText>
          <AppText variant="caption" className="text-gray-400">
            {user.email}
          </AppText>
        </View>
      </View>

      <View className="h-px bg-gray-100 mb-5" />

      <View className="flex-row justify-between">
        <StatItem
          icon="school-outline"
          value={stats.enrolled}
          label="Enrolled"
          color="#3B82F6"
        />
        <StatItem
          icon="checkmark-circle-outline"
          value={stats.completed}
          label="Completed"
          color="#10B981"
        />
        <StatItem
          icon="bookmark-outline"
          value={stats.bookmarks}
          label="Saved"
          color="#8B5CF6"
        />
        <StatItem
          icon="trending-up-outline"
          value={`${stats.progress}%`}
          label="Progress"
          color="#F59E0B"
        />
      </View>
    </Animated.View>
  );
}
