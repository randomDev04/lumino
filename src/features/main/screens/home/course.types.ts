// ── Types ──────────────────────────────────────────────
export type Course = {
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
