export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  instructor?: Instructor;
  isBookmarked?: boolean;
  isEnrolled?: boolean;
  level: "Beginner" | "Intermediate" | "Advanced";

  rating: number;
  isBestseller?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
}
