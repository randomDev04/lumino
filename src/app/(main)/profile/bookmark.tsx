import { useCourseStore } from "@/features/main/store/useCourseStore";
import { useTheme } from "@/shared/hooks";
import {
  AppButton,
  AppText,
  CustomHeader,
  FadeSlideIn,
  ScreenWrapper,
} from "@/shared/ui";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Modal, Pressable, View } from "react-native";
import Animated, { FadeInDown, FadeOutRight } from "react-native-reanimated";

const BookmarkedCourseItem = ({
  item,
  isGridView,
  isDark,
  index,
  onRemove,
}: any) => {
  const containerStyle = `${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm overflow-hidden`;

  if (isGridView) {
    return (
      <FadeSlideIn delay={index * 100}>
        <View className={`w-[48%] mb-4 ${containerStyle}`}>
          <Image source={{ uri: item.thumbnail }} className="w-full h-32" />
          <View className="p-3">
            <AppText
              variant="caption"
              className="text-orange-500 font-bold uppercase"
            >
              {item.category}
            </AppText>
            <AppText
              variant="body2"
              className="font-bold h-10"
              numberOfLines={2}
            >
              {item.title}
            </AppText>
            <AppText variant="h3" className="mt-1">
              ${item.price}
            </AppText>
          </View>
          <Pressable
            onPress={onRemove}
            className="absolute top-2 right-2 bg-black/40 p-1.5 rounded-full"
          >
            <Ionicons name="bookmark" size={14} color="#f97316" />
          </Pressable>
        </View>
      </FadeSlideIn>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      exiting={FadeOutRight}
      className={`flex-row h-28 mb-4 ${containerStyle}`}
    >
      <Image source={{ uri: item.thumbnail }} className="w-28 h-full" />
      <View className="flex-1 p-3 justify-between">
        <View>
          <AppText variant="caption" className="text-orange-500 font-bold">
            {item.category}
          </AppText>
          <AppText variant="body" className="font-bold" numberOfLines={1}>
            {item.title}
          </AppText>
        </View>
        <View className="flex-row justify-between items-end">
          <AppText variant="h3">${item.price}</AppText>
          <AppText variant="caption" className="text-gray-400 italic">
            by{" "}
            {item?.instructor?.name
              ? `${item.instructor.name.first || ""} ${item.instructor.name.last || ""}`
              : "Unknown"}
          </AppText>
        </View>
      </View>
      <Pressable onPress={onRemove} className="absolute top-2 right-2 p-2">
        <Ionicons name="trash-outline" size={18} color="#ef4444" />
      </Pressable>
    </Animated.View>
  );
};

function BookmarkScreen() {
  const { courses, toggleBookmark } = useCourseStore();
  const { isDark } = useTheme();
  const router = useRouter();
  const [isGridView, setIsGridView] = useState(false);
  const [sortModal, setSortModal] = useState(false);

  const bookmarkedCourses = courses.filter((c) => c.isBookmarked);

  const removeItem = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toggleBookmark(id);
  };

  return (
    <ScreenWrapper safeArea={false}>
      {/* Header Section */}
      <CustomHeader
        title="Bookmarks"
        showBack
        onBack={() => router.back()}
        onRightPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setIsGridView(!isGridView);
        }}
        rightIcon={isGridView ? "list-outline" : "grid-outline"}
      />

      {/* Content Section */}
      {bookmarkedCourses.length > 0 ? (
        <FlatList
          data={bookmarkedCourses}
          key={isGridView ? "grid" : "list"}
          numColumns={isGridView ? 2 : 1}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={
            isGridView ? { justifyContent: "space-between" } : null
          }
          renderItem={({ item, index }) => (
            <BookmarkedCourseItem
              item={item}
              index={index}
              isGridView={isGridView}
              isDark={isDark}
              onRemove={() => removeItem(item.id)}
            />
          )}
          contentContainerStyle={{
            paddingBottom: 100,
            marginTop: 10,
            padding: 10,
          }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <FadeSlideIn>
            <View className="items-center px-10">
              <View className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full mb-6">
                <Ionicons name="bookmark-outline" size={60} color="#9CA3AF" />
              </View>
              <AppText variant="h2" className="text-center">
                Your list is empty
              </AppText>
              <AppText
                variant="body2"
                className="text-center text-gray-500 mt-2 mb-8"
              >
                Looks like you haven't saved any courses yet. Start exploring to
                fill this up!
              </AppText>
              <AppButton
                title="Find Courses"
                onPress={() => router.push("/")}
                className="w-full"
              />
            </View>
          </FadeSlideIn>
        </View>
      )}

      {/* Simple Sort Modal */}
      <Modal visible={sortModal} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/50 justify-center px-6"
          onPress={() => setSortModal(false)}
        >
          <View
            className={`${isDark ? "bg-gray-900" : "bg-white"} p-6 rounded-3xl`}
          >
            <AppText variant="h3" className="mb-4">
              Sort options coming soon
            </AppText>
            <AppButton title="Close" onPress={() => setSortModal(false)} />
          </View>
        </Pressable>
      </Modal>
    </ScreenWrapper>
  );
}

export default BookmarkScreen;
