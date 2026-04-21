import { useCourseStore } from "@/features/main/store/useCourseStore";
import { useTheme } from "@/shared/hooks";
import {
  AppButton,
  AppIcon,
  AppText,
  FadeSlideIn,
  ScreenWrapper,
} from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// --- SUB-COMPONENT: COURSE CARD ---
const EnrolledItem = ({ item, isGridView, isDark, index }: any) => {
  const progress = item.progress ?? Math.floor(Math.random() * 100);
  const isComplete = progress === 100;

  return (
    <FadeSlideIn delay={index * 100}>
      <Pressable
        className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-3xl overflow-hidden mb-4 shadow-sm border ${isDark ? "border-gray-700" : "border-gray-100"}`}
        style={
          isGridView ? { width: "100%" } : { flexDirection: "row", height: 120 }
        }
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={
            isGridView
              ? { width: "100%", height: 120 }
              : { width: 120, height: 120 }
          }
        />

        <View className="p-3 flex-1 justify-between">
          <View>
            <View className="flex-row justify-between items-start">
              <AppText
                variant="caption"
                className="text-orange-500 font-bold uppercase"
              >
                {item.category}
              </AppText>
              {isComplete && (
                <AppIcon
                  icon={{
                    type: "expo",
                    family: "Ionicons",
                    name: "checkmark-circle",
                  }}
                  size={16}
                  color="#10B981"
                />
              )}
            </View>
            <AppText variant="body2" className="font-bold" numberOfLines={1}>
              {item.title}
            </AppText>
          </View>

          <View>
            <View className="flex-row justify-between mb-1">
              <AppText variant="caption" className="text-gray-400">
                {progress}% Complete
              </AppText>
            </View>
            <View
              className={`h-1.5 w-full rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <View
                style={{ width: `${progress}%` }}
                className={`h-full rounded-full ${isComplete ? "bg-green-500" : "bg-blue-500"}`}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </FadeSlideIn>
  );
};

export default function EnrolledCoursesScreen() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { courses } = useCourseStore();

  const [isGridView, setIsGridView] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const enrolledCourses = courses.filter((c) => c.isEnrolled);

  return (
    <ScreenWrapper
      safeArea={false}
      className={isDark ? "bg-gray-900" : "bg-gray-50"}
    >
      {/* Header with Top Inset Padding */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-blue-500 px-6 pb-6 rounded-b-[40px] shadow-lg"
      >
        <View className="flex-row items-center justify-between mt-4">
          <Pressable
            onPress={() => router.back()}
            className="bg-white/20 p-2 rounded-xl"
          >
            <AppIcon
              icon={{ type: "expo", family: "Ionicons", name: "chevron-back" }}
              color="white"
              size={24}
            />
          </Pressable>

          <View className="flex-row">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsGridView(!isGridView);
              }}
              className="bg-white/20 p-2 rounded-xl mr-2"
            >
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: isGridView ? "list" : "grid",
                }}
                color="white"
                size={22}
              />
            </Pressable>
            <Pressable
              onPress={() => setShowSort(true)}
              className="bg-white/20 p-2 rounded-xl"
            >
              <AppIcon
                icon={{ type: "expo", family: "Ionicons", name: "filter" }}
                color="white"
                size={22}
              />
            </Pressable>
          </View>
        </View>

        <View className="mt-6">
          <AppText variant="h1" style={{ color: "white" }}>
            My Learning
          </AppText>
          <AppText style={{ color: "white" }}>
            You have {enrolledCourses.length} courses in progress
          </AppText>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={enrolledCourses}
        key={isGridView ? "grid" : "list"}
        numColumns={isGridView ? 2 : 1}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        columnWrapperStyle={
          isGridView ? { justifyContent: "space-between" } : null
        }
        renderItem={({ item, index }) => (
          <View style={isGridView ? { width: "48%" } : { width: "100%" }}>
            <EnrolledItem
              item={item}
              index={index}
              isGridView={isGridView}
              isDark={isDark}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <AppIcon
              icon={{
                type: "expo",
                family: "Ionicons",
                name: "journal-outline",
              }}
              size={80}
              color="#CBD5E1"
            />
            <AppText variant="h2" className="mt-4">
              No courses yet
            </AppText>
            <AppButton
              title="Browse Catalog"
              className="mt-6"
              onPress={() => router.push("/")}
            />
          </View>
        }
      />

      {/* Sort Modal */}
      <Modal visible={showSort} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowSort(false)}
        >
          <View
            className={`${isDark ? "bg-gray-900" : "bg-white"} p-8 rounded-t-[40px]`}
          >
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
            <AppText variant="h2" className="mb-6">
              Sort Courses
            </AppText>

            {["Most Recent", "Progress: High to Low", "Title: A-Z"].map(
              (option, i) => (
                <Pressable
                  key={i}
                  className={`flex-row items-center p-4 rounded-2xl mb-3 ${i === 0 ? "bg-blue-500" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <AppIcon
                    icon={{ type: "expo", family: "Ionicons", name: "star" }}
                    size={20}
                    color={i === 0 ? "white" : colors.textPrimary}
                  />
                  <AppText
                    className={`ml-4 font-bold ${i === 0 ? "text-white" : ""}`}
                  >
                    {option}
                  </AppText>
                </Pressable>
              ),
            )}
          </View>
        </Pressable>
      </Modal>
    </ScreenWrapper>
  );
}
