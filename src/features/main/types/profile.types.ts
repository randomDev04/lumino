export interface ProfileUser {
  name: string;
  email: string;
  username: string;
  role: string;
  avatar: string;
  joinedDate: string;
}

export interface ProfileStats {
  enrolled: number;
  bookmarks: number;
  completed: number;
  progress: number;
}

export interface ProfileMenuItem {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  route?: string | null;
  badge?: number | null;
  isLast?: boolean;
}
