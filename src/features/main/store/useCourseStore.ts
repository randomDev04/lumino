import { notificationService } from "@/shared/services";
import { storage } from "@/shared/storage";
import { create } from "zustand";
import { courseService } from "../services/course.service";
import { mapCourses } from "../utils";

/* ---------------- KEYS ---------------- */
const KEYS = {
  BOOKMARKS: "bookmarked_courses",
  ENROLLED: "enrolled_courses",
  COURSES: "cached_courses",
};

type CourseState = {
  courses: any[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  bookmarkedCourses: string[];
  enrolledCourses: string[];

  searchQuery: string;

  fetchCourses: () => Promise<void>;
  refreshCourses: () => Promise<void>;

  toggleBookmark: (courseId: string) => void;
  enrollCourse: (courseId: string) => void;

  hydrateLocal: () => void;

  setSearchQuery: (q: string) => void;

  reset: () => void;
};

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  loading: false,
  refreshing: false,
  error: null,

  bookmarkedCourses: [],
  enrolledCourses: [],

  searchQuery: "",

  /* ---------------- HYDRATE (MMKV) ---------------- */
  hydrateLocal: () => {
    const bookmarks = storage.getString(KEYS.BOOKMARKS);
    const enrolled = storage.getString(KEYS.ENROLLED);
    const cachedCourses = storage.getString(KEYS.COURSES);

    set({
      bookmarkedCourses: bookmarks ? JSON.parse(bookmarks) : [],
      enrolledCourses: enrolled ? JSON.parse(enrolled) : [],
      courses: cachedCourses ? JSON.parse(cachedCourses) : [],
    });
  },

  /* ---------------- FETCH ---------------- */
  fetchCourses: async () => {
    try {
      set({ loading: true, error: null });

      const [coursesRes, instructorsRes] = await Promise.all([
        courseService.getCourses(),
        courseService.getInstructors(),
      ]);

      const mapped = mapCourses(coursesRes.data, instructorsRes.data);

      const { bookmarkedCourses, enrolledCourses } = get();

      const finalCourses = mapped.map((c: any) => ({
        ...c,
        isBookmarked: bookmarkedCourses.includes(c.id),
        isEnrolled: enrolledCourses.includes(c.id),
      }));

      storage.set(KEYS.COURSES, JSON.stringify(finalCourses));

      set({
        courses: finalCourses,
        loading: false,
      });
    } catch (e: any) {
      set({
        error: e.message || "Failed to fetch",
        loading: false,
      });
    }
  },

  /* ---------------- REFRESH ---------------- */
  refreshCourses: async () => {
    set({ refreshing: true });
    await get().fetchCourses();
    set({ refreshing: false });
  },

  /* ---------------- BOOKMARK ---------------- */
  toggleBookmark: (courseId: string) => {
    const { bookmarkedCourses, courses } = get();

    const isBookmarked = bookmarkedCourses.includes(courseId);

    const updatedBookmarks = isBookmarked
      ? bookmarkedCourses.filter((id) => id !== courseId)
      : [...bookmarkedCourses, courseId];

    const updatedCourses = courses.map((c) =>
      c.id === courseId ? { ...c, isBookmarked: !isBookmarked } : c,
    );

    storage.set(KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));

    if (!isBookmarked) {
      const count = updatedBookmarks.length;

      if ([5, 10, 20].includes(count)) {
        notificationService.showBookmarkMilestoneNotification(count);
      }
    }

    set({
      bookmarkedCourses: updatedBookmarks,
      courses: updatedCourses,
    });
  },

  /* ---------------- ENROLL ---------------- */
  enrollCourse: (courseId: string) => {
    const { enrolledCourses, courses } = get();

    if (enrolledCourses.includes(courseId)) return;

    const updatedEnrolled = [...enrolledCourses, courseId];

    const updatedCourses = courses.map((c) =>
      c.id === courseId ? { ...c, isEnrolled: true } : c,
    );

    storage.set(KEYS.ENROLLED, JSON.stringify(updatedEnrolled));

    set({
      enrolledCourses: updatedEnrolled,
      courses: updatedCourses,
    });
  },

  /* ---------------- SEARCH ---------------- */
  setSearchQuery: (q) => set({ searchQuery: q }),

  reset: () => {
    storage.remove(KEYS.BOOKMARKS);
    storage.remove(KEYS.ENROLLED);
    storage.remove(KEYS.COURSES);

    set({
      courses: [],
      bookmarkedCourses: [],
      enrolledCourses: [],
      searchQuery: "",
      loading: false,
      refreshing: false,
      error: null,
    });
  },
}));
