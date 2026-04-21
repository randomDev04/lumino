import { Course } from "../../types/course.types";

export function mapCourses(products: any[], instructors: any[]): Course[] {
  const images = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"] as const;

  return products.map((p, index) => {
    const instructor = instructors[index % instructors.length];

    return {
      id: p.id?.toString() || `course-${index}`,
      title: p.title || "Untitled",
      description: p.description || "",
      price: p.price || 0,
      category: p.category || "General",
      thumbnail: images[index % images.length],

      totalStudents: Math.floor(Math.random() * 5000) + 500,

      duration: `${Math.floor(Math.random() * 10) + 1}h ${Math.floor(
        Math.random() * 60,
      )}m`,

      rating: Number((Math.random() * 1 + 4).toFixed(1)),
      isBestseller: Math.random() > 0.7,
      level: levels[Math.floor(Math.random() * levels.length)],

      instructor: instructor && {
        id: instructor?._id || "unknown",
        name: instructor?.name || "Unknown Instructor",
        email: instructor?.email || "",
        avatar:
          instructor?.avatar?.url ||
          "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(instructor?.name || "User"),
        username: instructor?.username || "",
      },
    };
  });
}
