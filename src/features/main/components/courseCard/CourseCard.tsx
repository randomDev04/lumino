import { AppIcon, AppText, FadeSlideIn } from "@/shared/ui";
import { Image, Pressable, View } from "react-native";
import { Course } from "../../types/course.types";

const LEVEL_COLORS: Record<Course["level"], string> = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

interface CourseCardProp {
  item: Course;
  index: number;
  onPress: () => void;
}

// ─────────────────────────────────────────────────────
export const CourseCard: React.FC<CourseCardProp> = ({ item, onPress }) => {
  return (
    <FadeSlideIn delay={0}>
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
              source={{ uri: item?.instructor?.avatar }}
              className="w-6 h-6 rounded-full mr-2"
            />
            <AppText variant="caption" className="text-gray-500">
              {item?.instructor?.username}
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
    </FadeSlideIn>
  );
};
