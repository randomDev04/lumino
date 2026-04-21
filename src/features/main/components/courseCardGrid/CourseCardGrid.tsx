// ─────────────────────────────────────────────────────
// CourseCardGrid — Grid View

import { AppIcon, AppText, FadeSlideIn } from "@/shared/ui";
import { Image, Pressable, useWindowDimensions, View } from "react-native";
import { Course } from "../../types/course.types";

interface CourseCardGridProp {
  item: Course;
  index: number;
  onPress: () => void;
}

// ─────────────────────────────────────────────────────
export const CourseCardGrid: React.FC<CourseCardGridProp> = ({
  item,
  index,
  onPress,
}) => {
  const { width } = useWindowDimensions();

  const CARD_WIDTH = (width - 32 - 12) / 2;
  return (
    <FadeSlideIn delay={0}>
      <View style={{ width: CARD_WIDTH }}>
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

            <AppText
              variant="body2"
              className="font-bold mb-1"
              numberOfLines={2}
            >
              {item.title}
            </AppText>

            <AppText
              variant="caption"
              className="text-gray-400 mb-2"
              numberOfLines={1}
            >
              {item?.instructor
                ? `${item.instructor.first ?? ""} ${item.instructor.last ?? ""}`.trim()
                : "Unknown Instructor"}
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
      </View>
    </FadeSlideIn>
  );
};
