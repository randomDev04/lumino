import {
    AppIcon,
    AppText,
    AppTextInput,
    FadeSlideIn,
    ScreenWrapper,
} from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Modal, Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Types ──────────────────────────────────────────────
type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
  };
  rating: number;
  totalStudents: number;
  duration: string; // e.g. "12h 30m"
  price: number;
  isBestseller?: boolean;
  level: "Beginner" | "Intermediate" | "Advanced";
};

// ── Mock Data ──────────────────────────────────────────
const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Complete React Native Developer in 2024",
    description:
      "Build mobile apps for iOS and Android using React Native, Expo, and TypeScript from scratch.",
    category: "Mobile Dev",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    instructor: {
      name: "Arjun Sharma",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    rating: 4.8,
    totalStudents: 12400,
    duration: "24h 10m",
    price: 1299,
    isBestseller: true,
    level: "Beginner",
  },
  {
    id: "2",
    title: "UI/UX Design Masterclass",
    description:
      "Master Figma, design systems, and user research to build stunning digital products.",
    category: "Design",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    instructor: {
      name: "Priya Nair",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    rating: 4.7,
    totalStudents: 8900,
    duration: "18h 45m",
    price: 999,
    level: "Intermediate",
  },
  {
    id: "3",
    title: "Node.js & MongoDB: Backend Bootcamp",
    description:
      "Build scalable REST APIs, authentication systems and deploy to production with Node.js.",
    category: "Backend",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    instructor: {
      name: "Rahul Verma",
      avatar: "https://i.pravatar.cc/150?img=33",
    },
    rating: 4.9,
    totalStudents: 15600,
    duration: "30h 20m",
    price: 1499,
    isBestseller: true,
    level: "Intermediate",
  },
  {
    id: "4",
    title: "Python for Data Science & ML",
    description:
      "From Python basics to machine learning models. Includes Pandas, NumPy, and Scikit-learn.",
    category: "Data Science",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    instructor: {
      name: "Sneha Kapoor",
      avatar: "https://i.pravatar.cc/150?img=21",
    },
    rating: 4.6,
    totalStudents: 21000,
    duration: "40h 00m",
    price: 1799,
    level: "Beginner",
  },
  {
    id: "5",
    title: "Advanced TypeScript Patterns",
    description:
      "Deep dive into generics, decorators, mapped types and real-world architecture patterns.",
    category: "Web Dev",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    instructor: {
      name: "Karan Mehta",
      avatar: "https://i.pravatar.cc/150?img=60",
    },
    rating: 4.5,
    totalStudents: 5200,
    duration: "14h 15m",
    price: 1099,
    level: "Advanced",
  },
  {
    id: "6",
    title: "Flutter & Dart: Cross Platform Apps",
    description:
      "Build beautiful iOS and Android apps with Flutter. State management with Riverpod included.",
    category: "Mobile Dev",
    thumbnail:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800",
    instructor: {
      name: "Anjali Singh",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
    rating: 4.7,
    totalStudents: 9800,
    duration: "22h 30m",
    price: 1199,
    level: "Beginner",
  },
];

const SORT_OPTIONS = [
  { key: "default", label: "Default", icon: "apps-outline" },
  { key: "title", label: "Title (A–Z)", icon: "text-outline" },
  { key: "rating", label: "Rating (High–Low)", icon: "star-outline" },
  { key: "price", label: "Price (Low–High)", icon: "cash-outline" },
  { key: "students", label: "Most Popular", icon: "people-outline" },
];

const LEVEL_COLORS: Record<Course["level"], string> = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

// ─────────────────────────────────────────────────────
// CourseCard — List View
// ─────────────────────────────────────────────────────
function CourseCard({
  item,
  index,
  onPress,
}: {
  item: Course;
  index: number;
  onPress: () => void;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <Pressable
        onPress={onPress}
        className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm active:opacity-90"
      >
        {/* Thumbnail */}
        <View className="w-full h-44 bg-gray-200">
          <Image
            source={{ uri: item.thumbnail }}
            className="w-full h-44"
            resizeMode="cover"
          />

          {/* Bestseller badge */}
          {item.isBestseller && (
            <View className="absolute top-3 left-3 bg-yellow-400 px-3 py-1 rounded-full">
              <AppText variant="caption" color="#000" className="font-bold">
                Bestseller
              </AppText>
            </View>
          )}

          {/* Price */}
          <View className="absolute top-3 right-3 bg-black/60 px-3 py-1 rounded-full">
            <AppText variant="caption" color="#fff" className="font-bold">
              ₹{item.price}
            </AppText>
          </View>
        </View>

        {/* Body */}
        <View className="p-4">
          {/* Category + Level */}
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-blue-50 px-2 py-0.5 rounded-full">
              <AppText
                variant="caption"
                className="text-blue-600 font-semibold"
              >
                {item.category}
              </AppText>
            </View>
            <View
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: LEVEL_COLORS[item.level] + "20" }}
            >
              <AppText
                variant="caption"
                className="font-semibold"
                color={LEVEL_COLORS[item.level]}
              >
                {item.level}
              </AppText>
            </View>
          </View>

          <AppText variant="h3" className="mb-1" numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText
            variant="body2"
            className="text-gray-400 mb-3"
            numberOfLines={2}
          >
            {item.description}
          </AppText>

          {/* Instructor */}
          <View className="flex-row items-center mb-3">
            <Image
              source={{ uri: item.instructor.avatar }}
              className="w-6 h-6 rounded-full mr-2"
            />
            <AppText variant="caption" className="text-gray-500">
              {item.instructor.name}
            </AppText>
          </View>

          {/* Stats Row */}
          <View className="flex-row items-center gap-4">
            {/* Rating */}
            <View className="flex-row items-center">
              <AppIcon
                icon={{ type: "expo", family: "Ionicons", name: "star" }}
                size={13}
                color="#F59E0B"
              />
              <AppText variant="caption" className="ml-1 font-semibold">
                {item.rating.toFixed(1)}
              </AppText>
            </View>

            {/* Students */}
            <View className="flex-row items-center">
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: "people-outline",
                }}
                size={13}
                color="#9CA3AF"
              />
              <AppText variant="caption" className="ml-1 text-gray-400">
                {(item.totalStudents / 1000).toFixed(1)}k
              </AppText>
            </View>

            {/* Duration */}
            <View className="flex-row items-center">
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: "time-outline",
                }}
                size={13}
                color="#9CA3AF"
              />
              <AppText variant="caption" className="ml-1 text-gray-400">
                {item.duration}
              </AppText>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────
// CourseCardGrid — Grid View
// ─────────────────────────────────────────────────────
function CourseCardGrid({
  item,
  index,
  onPress,
}: {
  item: Course;
  index: number;
  onPress: () => void;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      className="w-[48%] mb-4"
    >
      <Pressable
        onPress={onPress}
        className="bg-white rounded-2xl overflow-hidden shadow-sm active:opacity-90"
      >
        {/* Thumbnail */}
        <View className="w-full h-28 bg-gray-200">
          <Image
            source={{ uri: item.thumbnail }}
            className="w-full h-28"
            resizeMode="cover"
          />
          {item.isBestseller && (
            <View className="absolute top-2 left-2 bg-yellow-400 px-2 py-0.5 rounded-full">
              <AppText
                variant="caption"
                color="#000"
                className="font-bold text-[9px]"
              >
                Bestseller
              </AppText>
            </View>
          )}
        </View>

        {/* Info */}
        <View className="p-3">
          <View className="bg-blue-50 self-start px-2 py-0.5 rounded-full mb-1">
            <AppText
              variant="caption"
              className="text-blue-600 font-semibold text-[10px]"
            >
              {item.category}
            </AppText>
          </View>

          <AppText variant="body2" className="font-bold mb-1" numberOfLines={2}>
            {item.title}
          </AppText>

          <AppText
            variant="caption"
            className="text-gray-400 mb-2"
            numberOfLines={1}
          >
            {item.instructor.name}
          </AppText>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <AppIcon
                icon={{ type: "expo", family: "Ionicons", name: "star" }}
                size={11}
                color="#F59E0B"
              />
              <AppText variant="caption" className="ml-0.5 font-semibold">
                {item.rating.toFixed(1)}
              </AppText>
            </View>
            <AppText variant="caption" className="text-blue-600 font-bold">
              ₹{item.price}
            </AppText>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────
// SortSheet
// ─────────────────────────────────────────────────────
function SortSheet({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
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
}

// ─────────────────────────────────────────────────────
// HomeScreen
// ─────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isGridView, setIsGridView] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [showSort, setShowSort] = useState(false);

  const categories = useMemo(
    () => ["All", ...new Set(MOCK_COURSES.map((c) => c.category))],
    [],
  );

  const filtered = useMemo(() => {
    let result = MOCK_COURSES;

    if (selectedCategory !== "All") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      );
    }

    if (sortBy === "title")
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "rating")
      result = [...result].sort((a, b) => b.rating - a.rating);
    if (sortBy === "price")
      result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "students")
      result = [...result].sort((a, b) => b.totalStudents - a.totalStudents);

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

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

  return (
    <ScreenWrapper safeArea={false} statusBarStyle="dark">
      {/* ── Header ── */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="bg-white px-4 pb-3 shadow-sm"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <AppText variant="h2">Learnexia 📚</AppText>
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
                {MOCK_COURSES.length} Courses
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
