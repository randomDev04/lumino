//importing 
//ENDPOINTS - has all servder Urls
//publicClient - bcz working on login screen and no need of privateClient 
import { ENDPOINTS, publicClient } from "@/shared/services";

export type LoginPayload = {
    email: string;
    password: string;
}

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    user: any;
}

export const myAuthService = {
    login(payload: LoginPayload) {
        return publicClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN,payload);
    }
}