import { useCourseStore } from "@/features/main/store/useCourseStore";
import { useTheme } from "@/shared/hooks";
import { AppButton, AppIcon, AppText, ScreenWrapper } from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Share, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 300;

// ── Types ──────────────────────────────────────────────
type Level = "Beginner" | "Intermediate" | "Advanced";

const LEVEL_COLORS: Record<Level, string> = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

// ─────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  color,
  delay,
}: {
  icon: string;
  value: string;
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
        className="w-11 h-11 rounded-2xl items-center justify-center mb-1"
        style={{ backgroundColor: color + "20" }}
      >
        <AppIcon
          icon={{ type: "expo", family: "Ionicons", name: icon as any }}
          size={22}
          color={color}
        />
      </View>
      <AppText variant="body2" className="font-bold">
        {value}
      </AppText>
      <AppText variant="caption" className="text-gray-400">
        {label}
      </AppText>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────
// AccordionSection
// ─────────────────────────────────────────────────────
function AccordionSection({
  title,
  badge,
  isOpen,
  onToggle,
  children,
  delay,
}: {
  title: string;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500)}
      className="mb-4"
    >
      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl"
      >
        <View className="flex-row items-center gap-2">
          <AppText variant="h3">{title}</AppText>
          {badge && (
            <View className="bg-yellow-400 px-2 py-0.5 rounded-full flex-row items-center">
              <AppIcon
                icon={{ type: "expo", family: "Ionicons", name: "star" }}
                size={11}
                color="#78350F"
              />
              <AppText
                variant="caption"
                color="#78350F"
                className="ml-0.5 font-bold"
              >
                {badge}
              </AppText>
            </View>
          )}
        </View>
        <AppIcon
          icon={{
            type: "expo",
            family: "Ionicons",
            name: isOpen ? "chevron-up" : "chevron-down",
          }}
          size={22}
          color="#9CA3AF"
        />
      </Pressable>

      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          className="mt-2 px-1"
        >
          {children}
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────
// CourseDetailScreen
// ─────────────────────────────────────────────────────
export default function CourseDetailScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { courses, fetchCourses, toggleBookmark, enrollCourse } =
    useCourseStore();

  const course = courses.find((c) => c.id === id);

  const [openSection, setOpenSection] = useState<string | null>("learn");

  const scrollY = useSharedValue(0);
  const enrollScale = useSharedValue(1);

  let user = {
    title: "Mr",
    first: "John",
    last: "Doe",
  };

  useEffect(() => {
    if (!courses.length) {
      fetchCourses();
    }
  }, []);

  // ── Scroll handler ─────────────────────────────────
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  // ── Parallax header ────────────────────────────────
  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(1, 1 + scrollY.value / 1000) }],
    opacity: Math.max(0, 1 - scrollY.value / 220),
  }));

  // ── Sticky nav ─────────────────────────────────────
  const stickyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(scrollY.value > 220 ? 0 : -(insets.top + 56)) },
    ],
  }));

  // ── Enroll ─────────────────────────────────────────
  const handleEnroll = () => {
    if (course.isEnrolled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    enrollScale.value = withSequence(
      withSpring(0.93),
      withSpring(1.04),
      withSpring(1),
    );

    enrollCourse(course.id);
  };
  const enrollButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: enrollScale.value }],
  }));

  const toggleSection = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOpenSection((prev) => (prev === key ? null : key));
  };

  if (!courses.length) {
    return (
      <ScreenWrapper safeArea>
        <View className="flex-1 items-center justify-center">
          <AppText>Loading course...</AppText>
        </View>
      </ScreenWrapper>
    );
  }

  // ── Not found ──────────────────────────────────────
  if (!course) {
    return (
      <ScreenWrapper safeArea>
        <View className="flex-1 items-center justify-center px-6">
          <AppIcon
            icon={{
              type: "expo",
              family: "Ionicons",
              name: "alert-circle-outline",
            }}
            size={56}
            color="#D1D5DB"
          />
          <AppText variant="h3" className="mt-4 text-gray-400">
            Course not found
          </AppText>
          <AppButton
            title="Go Back"
            variant="outline"
            className="mt-6 w-40"
            onPress={() => router.back()}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* ── Sticky Header (appears after scroll) ── */}
      <Animated.View
        style={[
          stickyStyle,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            paddingTop: insets.top,
            backgroundColor: "#3B82F6",
          },
        ]}
      >
        <View className="h-14 flex-row items-center px-4 gap-3">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <AppIcon
              icon={{ type: "expo", family: "Ionicons", name: "arrow-back" }}
              size={24}
              color="#fff"
            />
          </Pressable>
          <AppText
            variant="body2"
            color="#fff"
            className="flex-1 font-bold"
            numberOfLines={1}
          >
            {course.title}
          </AppText>
          <Pressable
            onPress={() =>
              Share.share({ message: `Check out: ${course.title}` })
            }
            hitSlop={8}
          >
            <AppIcon
              icon={{ type: "expo", family: "Ionicons", name: "share-outline" }}
              size={22}
              color="#fff"
            />
          </Pressable>
        </View>
      </Animated.View>

      {/* ── Scrollable Content ── */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* ── Parallax Thumbnail ── */}
        <Animated.View style={[headerStyle, { height: HEADER_HEIGHT }]}>
          <Image
            source={{ uri: course.thumbnail }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.75)"]}
            style={{ position: "absolute", inset: 0 }}
          />

          {/* Top Action Row */}
          <View
            className="absolute left-4 right-4 flex-row justify-between"
            style={{ top: insets.top + 8 }}
          >
            <Pressable
              onPress={() => router.back()}
              className="bg-white/90 p-2 rounded-full"
            >
              <AppIcon
                icon={{ type: "expo", family: "Ionicons", name: "arrow-back" }}
                size={22}
                color="#1F2937"
              />
            </Pressable>

            <View className="flex-row gap-2">
              <Pressable
                onPress={() => router.push(`/courses/webView/${course.id}`)}
                className={`${isDark ? "bg-gray-800/90" : "bg-white/90"} p-2 rounded-full shadow-md mr-2`}
              >
                <AppIcon
                  icon={{
                    type: "expo",
                    family: "Ionicons",
                    name: "globe-outline",
                  }}
                  size={22}
                  color={isDark ? "#F3F4F6" : "#1F2937"}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleBookmark(course.id);
                }}
                className="bg-white/90 p-2 rounded-full"
              >
                <AppIcon
                  icon={{
                    type: "expo",
                    family: "Ionicons",
                    name: course.isBookmarked ? "bookmark" : "bookmark-outline",
                  }}
                  size={22}
                  color={course.isBookmarked ? "#3B82F6" : "#1F2937"}
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  Share.share({ message: `Check out: ${course.title}` })
                }
                className="bg-white/90 p-2 rounded-full"
              >
                <AppIcon
                  icon={{
                    type: "expo",
                    family: "Ionicons",
                    name: "share-outline",
                  }}
                  size={22}
                  color="#1F2937"
                />
              </Pressable>
            </View>
          </View>

          {/* Enrolled Badge */}
          {course.isEnrolled && (
            <View className="absolute bottom-4 left-4 bg-green-500 px-4 py-1.5 rounded-full flex-row items-center gap-1">
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: "checkmark-circle",
                }}
                size={16}
                color="#fff"
              />
              <AppText variant="caption" color="#fff" className="font-bold">
                Enrolled
              </AppText>
            </View>
          )}
        </Animated.View>

        <View className="px-5 pt-5">
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            className="flex-row flex-wrap gap-2 mb-3"
          >
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <AppText
                variant="caption"
                className="text-blue-600 font-semibold"
              >
                {course.category}
              </AppText>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: LEVEL_COLORS[course?.level] + "20" }}
            >
              <AppText
                variant="caption"
                style={{ color: LEVEL_COLORS[course?.level] }}
                className="font-semibold"
              >
                {course.level}
              </AppText>
            </View>
            {course.isBestseller && (
              <View className="bg-yellow-400 px-3 py-1 rounded-full">
                <AppText
                  variant="caption"
                  color="#78350F"
                  className="font-bold"
                >
                  Bestseller
                </AppText>
              </View>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <AppText variant="h1" className="mb-3 leading-tight">
              {course.title}
            </AppText>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="flex-row items-center gap-3 mb-5"
          >
            <View className="flex-row items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <AppIcon
                  key={s}
                  icon={{ type: "expo", family: "Ionicons", name: "star" }}
                  size={14}
                  color={s <= Math.round(course.rating) ? "#F59E0B" : "#D1D5DB"}
                />
              ))}
            </View>
            <AppText variant="body2" className="font-bold text-gray-700">
              {course.rating.toFixed(1)}
            </AppText>
            <AppText variant="caption" className="text-gray-400">
              ({(course.totalStudents / 1000).toFixed(1)}k students)
            </AppText>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(250).duration(500)}
            className="flex-row bg-gray-50 rounded-2xl p-4 mb-5"
          >
            <StatCard
              icon="time-outline"
              value={course.duration}
              label="Duration"
              color="#3B82F6"
              delay={300}
            />
            <View className="w-px bg-gray-200 mx-2" />
            <StatCard
              icon="play-circle-outline"
              value={`${course.totalLessons}`}
              label="Lessons"
              color="#8B5CF6"
              delay={350}
            />
            <View className="w-px bg-gray-200 mx-2" />
            <StatCard
              icon="people-outline"
              value={`${(course.totalStudents / 1000).toFixed(1)}k`}
              label="Students"
              color="#10B981"
              delay={400}
            />
            <View className="w-px bg-gray-200 mx-2" />
            <StatCard
              icon="bar-chart-outline"
              value={course.level}
              label="Level"
              color="#F59E0B"
              delay={450}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInRight.delay(300).duration(500)}
            className="flex-row items-center bg-gray-50 p-4 rounded-2xl mb-5"
          >
            <Image
              source={{ uri: course.instructor.avatar }}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View className="flex-1">
              <AppText variant="caption" className="text-gray-400 mb-0.5">
                Instructor
              </AppText>
              <AppText variant="h3" className="mb-0.5">
                {`${user.title} ${user.first} ${user.last}`}
              </AppText>
              <AppText variant="caption" className="text-gray-400 mb-1">
                {course.instructor.bio}
              </AppText>
              <View className="flex-row gap-3">
                <View className="flex-row items-center gap-1">
                  <AppIcon
                    icon={{
                      type: "expo",
                      family: "Ionicons",
                      name: "people-outline",
                    }}
                    size={12}
                    color="#9CA3AF"
                  />
                  <AppText variant="caption" className="text-gray-400">
                    {(course.instructor.totalStudents / 1000).toFixed(0)}k
                    students
                  </AppText>
                </View>
                <View className="flex-row items-center gap-1">
                  <AppIcon
                    icon={{
                      type: "expo",
                      family: "Ionicons",
                      name: "book-outline",
                    }}
                    size={12}
                    color="#9CA3AF"
                  />
                  <AppText variant="caption" className="text-gray-400">
                    {course.instructor.totalCourses} courses
                  </AppText>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
            className="mb-5"
          >
            <AppText variant="h3" className="mb-2">
              About This Course
            </AppText>
            <AppText variant="body2" className="text-gray-500 leading-6">
              {course.description}
            </AppText>
          </Animated.View>

          <AccordionSection
            title="What You'll Learn"
            isOpen={openSection === "learn"}
            onToggle={() => toggleSection("learn")}
            delay={450}
          >
            {[
              `Understand ${course.category} fundamentals`,
              `Build real-world ${course.category} projects`,
              `Learn from ${course.instructor?.name || "expert instructors"}`,
              `Improve problem-solving skills`,
            ].map((item, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(i * 60).duration(350)}
                className="flex-row items-start mb-3"
              >
                <View className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <AppIcon
                    icon={{
                      type: "expo",
                      family: "Ionicons",
                      name: "checkmark",
                    }}
                    size={14}
                    color="#22C55E"
                  />
                </View>
                <AppText variant="body2" className="text-gray-600 flex-1">
                  {item}
                </AppText>
              </Animated.View>
            ))}
          </AccordionSection>

          <AccordionSection
            title="Curriculum"
            isOpen={openSection === "curriculum"}
            onToggle={() => toggleSection("curriculum")}
            delay={500}
          >
            {[
              { title: "Introduction", duration: "10m", isPreview: true },
              { title: "Core Concepts", duration: "25m" },
              { title: "Advanced Topics", duration: "40m" },
            ].map((lesson, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(i * 60).duration(350)}
                className="flex-row items-center bg-white border border-gray-100 p-4 rounded-xl mb-2"
              >
                <View className="bg-blue-500 w-8 h-8 rounded-full items-center justify-center mr-3">
                  <AppText variant="caption" color="#fff" className="font-bold">
                    {i + 1}
                  </AppText>
                </View>

                <AppText
                  variant="body2"
                  className="flex-1 text-gray-700 font-medium"
                >
                  {lesson.title}
                </AppText>

                <View className="flex-row items-center gap-2">
                  {lesson.isPreview && (
                    <View className="bg-green-50 px-2 py-0.5 rounded-full">
                      <AppText
                        variant="caption"
                        className="text-green-600 font-semibold"
                      >
                        Free
                      </AppText>
                    </View>
                  )}

                  <AppText variant="caption" className="text-gray-400">
                    {lesson.duration}
                  </AppText>
                </View>
              </Animated.View>
            ))}
          </AccordionSection>

          <AccordionSection
            title="Requirements"
            isOpen={openSection === "requirements"}
            onToggle={() => toggleSection("requirements")}
            delay={550}
          >
            {[
              "Master the fundamentals and advanced concepts",
              "Build real-world projects from scratch",
              "Best practices and industry standards",
              "Problem-solving and critical thinking skills",
            ].map((req, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(i * 60).duration(350)}
                className="flex-row items-start mb-3"
              >
                <View className="bg-blue-50 p-1 rounded-full mr-3 mt-0.5">
                  <AppIcon
                    icon={{ type: "expo", family: "Ionicons", name: "ellipse" }}
                    size={8}
                    color="#3B82F6"
                  />
                </View>
                <AppText variant="body2" className="text-gray-600 flex-1">
                  {req}
                </AppText>
              </Animated.View>
            ))}
          </AccordionSection>

          {/* ── Reviews ── */}
          <AccordionSection
            title="Reviews"
            badge={course.rating.toFixed(1)}
            isOpen={openSection === "reviews"}
            onToggle={() => toggleSection("reviews")}
            delay={600}
          >
            <View className="items-center py-8">
              <AppIcon
                icon={{
                  type: "expo",
                  family: "Ionicons",
                  name: "star-outline",
                }}
                size={40}
                color="#D1D5DB"
              />
              <AppText variant="body2" className="text-gray-300 mt-3">
                Reviews coming soon
              </AppText>
            </View>
          </AccordionSection>

          {/* ── Price Card ── */}
          <Animated.View
            entering={FadeInDown.delay(650).duration(500)}
            className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-2"
          >
            <View className="flex-row items-center justify-between">
              <View>
                <AppText variant="caption" className="text-gray-400 mb-1">
                  Course Price
                </AppText>
                <AppText variant="h1" className="text-blue-600">
                  ₹{course.price}
                </AppText>
              </View>
              <View className="bg-blue-100 px-4 py-2 rounded-full">
                <AppText
                  variant="caption"
                  className="text-blue-600 font-semibold"
                >
                  One-time payment
                </AppText>
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* ── Sticky Enroll Button ── */}
      <View
        className="px-5 pt-3 bg-white border-t border-gray-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Animated.View style={enrollButtonStyle}>
          <AppButton
            title={
              course.isEnrolled
                ? "✓ Already Enrolled"
                : `Enroll Now • ₹${course.price}`
            }
            variant={course.isEnrolled ? "secondary" : "primary"}
            disabled={course.isEnrolled}
            onPress={handleEnroll}
          />
        </Animated.View>
      </View>
    </View>
  );
}
