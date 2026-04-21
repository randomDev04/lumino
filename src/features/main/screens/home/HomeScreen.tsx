import {
  AppIcon,
  AppText,
  AppTextInput,
  FadeSlideIn,
  ScreenWrapper,
} from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CourseCard,
  CourseCardGrid,
  HomeSkeleton,
  SortSheet,
} from "../../components";
import { useCourseStore } from "../../store/useCourseStore";
import { Course } from "../../types/course.types";

// ─────────────────────────────────────────────────────
// HomeScreen
// ─────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const courses = useCourseStore((s) => s.courses);
  const loading = useCourseStore((s) => s.loading);
  const fetchCourses = useCourseStore((s) => s.fetchCourses);
  const hydrateLocal = useCourseStore((s) => s.hydrateLocal);
  const searchQuery = useCourseStore((s) => s.searchQuery);
  const setSearchQuery = useCourseStore((s) => s.setSearchQuery);
  const refreshing = useCourseStore((s) => s.refreshing);
  const refreshCourses = useCourseStore((s) => s.refreshCourses);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isGridView, setIsGridView] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    hydrateLocal();
    fetchCourses();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(courses.map((c) => c.category))],
    [courses],
  );

  const filtered = useMemo(() => {
    let result = courses;

    if (selectedCategory !== "All") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.instructor?.name?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q),
      );
    }

    if (sortBy === "title") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === "price") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    return result;
  }, [courses, selectedCategory, searchQuery, sortBy]);

  const onRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await refreshCourses();
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Course; index: number }) =>
      isGridView ? (
        <CourseCardGrid
          item={item}
          index={index}
          onPress={() => router.push(`/courses/${item.id}`)}
        />
      ) : (
        <CourseCard
          item={item}
          index={index}
          onPress={() => router.push(`/courses/${item.id}`)}
        />
      ),
    [isGridView, router],
  );

  const keyExtractor = useCallback((item: Course) => item.id, []);

  const ListHeader = (
    <>
      {/* Stats Banner */}
      <FadeSlideIn delay={0}>
        <View className="flex-row gap-3 pt-4 pb-2">
          <View className="flex-1 bg-blue-50 rounded-2xl p-3 items-center">
            <AppText variant="h2" className="text-blue-600">
              500+
            </AppText>
            <AppText variant="caption" className="text-blue-400">
              Courses
            </AppText>
          </View>
          <View className="flex-1 bg-purple-50 rounded-2xl p-3 items-center">
            <AppText variant="h2" className="text-purple-600">
              10k+
            </AppText>
            <AppText variant="caption" className="text-purple-400">
              Students
            </AppText>
          </View>
          <View className="flex-1 bg-green-50 rounded-2xl p-3 items-center">
            <AppText variant="h2" className="text-green-600">
              4.8★
            </AppText>
            <AppText variant="caption" className="text-green-400">
              Avg Rating
            </AppText>
          </View>
        </View>
      </FadeSlideIn>

      {/* Category Pills */}
      <FadeSlideIn delay={100}>
        <View className="flex-row flex-wrap gap-2 py-3">
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === cat ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <AppText
                variant="caption"
                className="font-semibold"
                color={selectedCategory === cat ? "#fff" : "#374151"}
              >
                {cat}
              </AppText>
            </Pressable>
          ))}
        </View>
      </FadeSlideIn>
    </>
  );

  const ListEmpty = (
    <View className="items-center justify-center py-20">
      <AppIcon
        icon={{ type: "expo", family: "Ionicons", name: "book-outline" }}
        size={48}
        color="#D1D5DB"
      />
      <AppText variant="h3" className="mt-4" color="#D1D5DB">
        No courses found
      </AppText>
      <AppText variant="caption" className="mt-1" color="#D1D5DB">
        Try a different search or category
      </AppText>
    </View>
  );

  if (loading) {
    return <HomeSkeleton isDark={false} />;
  }

  return (
    <ScreenWrapper safeArea={false} statusBarStyle="dark">
      {/* ── Header ── */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="bg-white px-4 pb-3 shadow-sm"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <AppText variant="h2">Lumino 📚</AppText>
            <AppText variant="caption" className="text-gray-400 mt-0.5">
              Explore & learn anything
            </AppText>
          </View>

          <View className="flex-row items-center gap-2">
            <View className="bg-blue-50 px-3 py-1.5 rounded-full">
              <AppText
                variant="caption"
                className="text-blue-500 font-semibold"
              >
                {courses.length} Courses
              </AppText>
            </View>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsGridView((p) => !p);
              }}
              className="bg-gray-100 p-2 rounded-full"
              hitSlop={6}
            >
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: isGridView ? "list-outline" : "grid-outline",
                }}
                size={20}
                color="#1F2937"
              />
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSort(true);
              }}
              className="bg-gray-100 p-2 rounded-full"
              hitSlop={6}
            >
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: "funnel-outline",
                }}
                size={20}
                color="#1F2937"
              />
            </Pressable>
          </View>
        </View>

        <AppTextInput
          placeholder="Search courses, instructors..."
          leftIcon="search-outline"
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerClassName="mb-0"
          variant="default"
        />
      </View>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={refreshing}
        onRefresh={onRefresh}
        key={isGridView ? "grid" : "list"}
        numColumns={isGridView ? 2 : 1}
        columnWrapperStyle={
          isGridView ? { justifyContent: "space-between" } : undefined
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 90,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={6}
        windowSize={8}
      />

      {/* ── Sort Sheet ── */}
      <SortSheet
        visible={showSort}
        selected={sortBy}
        onSelect={setSortBy}
        onClose={() => setShowSort(false)}
      />
    </ScreenWrapper>
  );
}
