import { ENDPOINTS, privateClient, publicClient } from "@/shared/services";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  username: string;
  role: "USER";
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: any;
};

export const authService = {
  //Login user
  login(payload: LoginPayload) {
    return publicClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, payload);
  },

  //Register user
  register(payload: RegisterPayload) {
    return publicClient.post<void>(ENDPOINTS.AUTH.REGISTER, payload);
  },

  //Forget user
  forgotPassword(email: string) {
    return publicClient.post<void>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  // Refresh handled by interceptor (no need here)
  updateAvatar: async (imageUri: string) => {
    const formData = new FormData();

    const filename = imageUri.split("/").pop() || "avatar.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    let uri = imageUri;

    // Android fix
    if (!uri.startsWith("file://") && !uri.startsWith("http")) {
      uri = `file://${uri}`;
    }

    formData.append("avatar", {
      uri,
      name: filename,
      type,
    } as any);

    return privateClient.patch<any>(ENDPOINTS.AUTH.UPDATE_AVATAR, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Logout (optional API call)
  logout() {
    return publicClient.post<void>(ENDPOINTS.AUTH.LOGOUT);
  },
};
