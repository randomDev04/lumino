import { useAuthStore } from "@/features/auth";
import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return isLoggedIn ? (
    <Redirect href="/(main)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
