import { AppText, SkeletonBox } from "@/shared/ui";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";

interface HomeSkeletonProps {
  isDark: boolean;
}

export function HomeSkeleton({ isDark }: HomeSkeletonProps) {
  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <View
        className={`${isDark ? "bg-gray-800" : "bg-white"} pt-14 pb-4 px-6 shadow-sm`}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <AppText
              className={`${
                isDark ? "text-white" : "text-gray-800"
              } text-2xl font-bold`}
            >
              Lumio
            </AppText>
            <AppText
              className={`${
                isDark ? "text-white/70" : "text-gray-500"
              } text-xs mt-0.5`}
            >
              Explore & Learn
            </AppText>
          </View>

          <View
            className={`${
              isDark ? "bg-white/20" : "bg-blue-50"
            } px-3 py-1.5 rounded-full`}
          >
            <AppText
              className={`${
                isDark ? "text-white" : "text-blue-600"
              } font-semibold text-xs`}
            >
              Loading...
            </AppText>
          </View>
        </View>

        {/* Search */}
        <View
          className={`${
            isDark ? "bg-gray-700" : "bg-gray-100"
          } rounded-2xl px-4 py-3 flex-row items-center`}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"}
          />
          <SkeletonBox
            isDark={isDark}
            style={{ flex: 1, height: 16, marginLeft: 12, borderRadius: 6 }}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="px-4 pt-4">
          <SkeletonBox
            isDark={isDark}
            style={{ width: "100%", height: 192, borderRadius: 24 }}
          />
        </View>

        {/* Categories */}
        <View className="px-4 py-4 flex-row">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBox
              key={i}
              isDark={isDark}
              style={{
                width: 70,
                height: 32,
                borderRadius: 999,
                marginRight: 8,
              }}
            />
          ))}
        </View>

        {/* Cards */}
        <View className="px-4 pb-4">
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl mb-4 overflow-hidden`}
            >
              {/* Image */}
              <SkeletonBox
                isDark={isDark}
                style={{ width: "100%", height: 192 }}
              />

              <View className="p-4">
                {/* Category */}
                <SkeletonBox
                  isDark={isDark}
                  style={{
                    width: 80,
                    height: 14,
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />

                {/* Title */}
                <SkeletonBox
                  isDark={isDark}
                  style={{
                    width: "100%",
                    height: 18,
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />

                {/* Desc */}
                <SkeletonBox
                  isDark={isDark}
                  style={{
                    width: "75%",
                    height: 14,
                    borderRadius: 6,
                    marginBottom: 12,
                  }}
                />

                {/* Footer */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <SkeletonBox
                      isDark={isDark}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        marginRight: 8,
                      }}
                    />
                    <SkeletonBox
                      isDark={isDark}
                      style={{ width: 100, height: 14, borderRadius: 6 }}
                    />
                  </View>

                  <SkeletonBox
                    isDark={isDark}
                    style={{ width: 60, height: 14, borderRadius: 6 }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
