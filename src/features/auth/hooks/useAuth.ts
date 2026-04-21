import { useAuthStore } from "../store";

export function useAuth() {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.clearSession);
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  return {
    user,
    token,
    isAuthenticated: !!token,
    loading: status === "loading",

    login,
    logout,
  };
}
