import { AppButton, AppIcon, AppText, ScreenWrapper } from "@/shared/ui";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, Pressable, Share, View } from "react-native";
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

// ── Constants ──────────────────────────────────────────
const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 300;
const ENROLL_GRADIENT = ["#3B82F6", "#8B5CF6"] as const;

// ── Types ──────────────────────────────────────────────
type Level = "Beginner" | "Intermediate" | "Advanced";

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
    username: string;
    bio: string;
    totalStudents: number;
    totalCourses: number;
  };
  rating: number;
  totalStudents: number;
  duration: string;
  totalLessons: number;
  price: number;
  level: Level;
  isBestseller?: boolean;
  isEnrolled?: boolean;
  isBookmarked?: boolean;
  whatYoullLearn: string[];
  curriculum: { title: string; duration: string; isPreview?: boolean }[];
  requirements: string[];
};

// ── Mock Data ──────────────────────────────────────────
const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Complete React Native Developer in 2024",
    description:
      "Build mobile apps for iOS and Android using React Native, Expo, and TypeScript. This course covers everything from fundamentals to production deployment, including state management, navigation, animations, and real-world API integration.",
    category: "Mobile Dev",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    instructor: {
      name: "Arjun Sharma",
      username: "arjunsharma",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "Senior Mobile Engineer at Razorpay. 8+ years building production apps.",
      totalStudents: 45000,
      totalCourses: 12,
    },
    rating: 4.8,
    totalStudents: 12400,
    duration: "24h 10m",
    totalLessons: 142,
    price: 1299,
    level: "Beginner",
    isBestseller: true,
    isEnrolled: false,
    isBookmarked: false,
    whatYoullLearn: [
      "Build cross-platform apps with React Native & Expo",
      "Master Redux Toolkit and Zustand for state management",
      "Implement complex animations with Reanimated 3",
      "Integrate REST APIs and handle authentication",
      "Deploy apps to App Store and Google Play",
      "Write clean, maintainable TypeScript code",
    ],
    curriculum: [
      { title: "Introduction & Setup", duration: "45 min", isPreview: true },
      {
        title: "React Native Fundamentals",
        duration: "2h 10m",
        isPreview: true,
      },
      { title: "Navigation with Expo Router", duration: "1h 30m" },
      { title: "State Management Deep Dive", duration: "3h 00m" },
      { title: "Animations with Reanimated", duration: "2h 45m" },
      { title: "API Integration & Auth", duration: "2h 20m" },
      { title: "Push Notifications", duration: "1h 15m" },
      { title: "Publishing to App Stores", duration: "1h 00m" },
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "Familiarity with React concepts",
      "A Mac or Windows computer",
      "No mobile development experience needed",
    ],
  },
  {
    id: "2",
    title: "UI/UX Design Masterclass",
    description:
      "Master Figma, design systems, and user research to build stunning digital products loved by users.",
    category: "Design",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    instructor: {
      name: "Priya Nair",
      username: "priyanair",
      avatar: "https://i.pravatar.cc/150?img=47",
      bio: "Lead Designer at Swiggy. Speaker at Design+Dev Summit.",
      totalStudents: 28000,
      totalCourses: 6,
    },
    rating: 4.7,
    totalStudents: 8900,
    duration: "18h 45m",
    totalLessons: 98,
    price: 999,
    level: "Intermediate",
    isBestseller: false,
    isEnrolled: false,
    isBookmarked: true,
    whatYoullLearn: [
      "Master Figma from scratch to advanced",
      "Build scalable design systems",
      "Conduct effective user research",
      "Create high-fidelity prototypes",
      "Hand off designs to developers",
    ],
    curriculum: [
      {
        title: "Design Thinking Fundamentals",
        duration: "1h 00m",
        isPreview: true,
      },
      { title: "Figma Basics", duration: "2h 30m", isPreview: true },
      { title: "Design Systems", duration: "3h 00m" },
      { title: "User Research Methods", duration: "2h 00m" },
      { title: "Prototyping & Testing", duration: "2h 15m" },
    ],
    requirements: [
      "No prior design experience needed",
      "Figma free account",
      "Creative mindset",
    ],
  },
];

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
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const course = MOCK_COURSES.find((c) => c.id === id) ?? MOCK_COURSES[0];

  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled ?? false);
  const [isBookmarked, setIsBookmarked] = useState(
    course.isBookmarked ?? false,
  );
  const [enrolling, setEnrolling] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("learn");

  const scrollY = useSharedValue(0);
  const enrollScale = useSharedValue(1);

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
    if (isEnrolled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    enrollScale.value = withSequence(
      withSpring(0.93),
      withSpring(1.04),
      withSpring(1),
    );
    setEnrolling(true);
    setTimeout(() => {
      setEnrolling(false);
      setIsEnrolled(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1400);
  };

  const enrollButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: enrollScale.value }],
  }));

  const toggleSection = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOpenSection((prev) => (prev === key ? null : key));
  };

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
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsBookmarked((p) => !p);
                }}
                className="bg-white/90 p-2 rounded-full"
              >
                <AppIcon
                  icon={{
                    type: "expo",
                    family: "Ionicons",
                    name: isBookmarked ? "bookmark" : "bookmark-outline",
                  }}
                  size={22}
                  color={isBookmarked ? "#3B82F6" : "#1F2937"}
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
          {isEnrolled && (
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

        {/* ── Body ── */}
        <View className="px-5 pt-5">
          {/* Category + Level + Bestseller */}
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
              style={{ backgroundColor: LEVEL_COLORS[course.level] + "20" }}
            >
              <AppText
                variant="caption"
                color={LEVEL_COLORS[course.level]}
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

          {/* Title */}
          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <AppText variant="h1" className="mb-3 leading-tight">
              {course.title}
            </AppText>
          </Animated.View>

          {/* Rating Row */}
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

          {/* Stats Row */}
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

          {/* Instructor */}
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
                {course.instructor.name}
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

          {/* Description */}
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

          {/* ── What You'll Learn ── */}
          <AccordionSection
            title="What You'll Learn"
            isOpen={openSection === "learn"}
            onToggle={() => toggleSection("learn")}
            delay={450}
          >
            {course.whatYoullLearn.map((item, i) => (
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

          {/* ── Curriculum ── */}
          <AccordionSection
            title="Curriculum"
            isOpen={openSection === "curriculum"}
            onToggle={() => toggleSection("curriculum")}
            delay={500}
          >
            {course.curriculum.map((lesson, i) => (
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

          {/* ── Requirements ── */}
          <AccordionSection
            title="Requirements"
            isOpen={openSection === "requirements"}
            onToggle={() => toggleSection("requirements")}
            delay={550}
          >
            {course.requirements.map((req, i) => (
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
              isEnrolled
                ? "✓  Already Enrolled"
                : enrolling
                  ? "Enrolling..."
                  : `Enroll Now  •  ₹${course.price}`
            }
            variant={isEnrolled ? "secondary" : "primary"}
            loading={enrolling}
            disabled={isEnrolled || enrolling}
            onPress={handleEnroll}
          />
        </Animated.View>
      </View>
    </View>
  );
}
