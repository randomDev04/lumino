import { useAuthStore } from "@/features/auth";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (isLoggedIn) {
    return <Redirect href="/(main)/home" />;
  }

  return <Slot />;
}
