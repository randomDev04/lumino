import { storage } from "@/shared/storage"; // help to save date permanetly on phone
import { create } from "zustand"; // this zustand lib create store
import { myAuthService } from "../services/myAuth.service"; // service file talk to server for login

//keys
const KEYS = {
    TOKEN: "my_token",
    REFRESH: "my_refresh_token",
    USER: "my_user",
}

type MyAuthState = {
    //data  // string | null - means can be text or empty
    token: string | null;
    refreshToken: string | null;
    user: any;  // any bcz we don't know exact shape 
    status: "idle" | "loading" | "authenticated";  //current situation can be any 1 of 3 
    loading: boolean;
    hydrated: boolean;

    //action (function)
    login: ( email: string, password: string) => Promise<void>; // function take email+pass and talk to server
    clearSession: () => void; // logout function , clear everything
    hydrate: () => void;  // check save token when app starts
}

export const useMyAuthStore = create<MyAuthState>((set, get) => ({

    //INTIAL VALUES- what store start with
    token: null,
    refreshToken: null,
    user: null,
    status: "idle",
    loading: false,
    hydrated: false,

    // LOGIN FUNCTION
    login: async (email, password) => {
        try {

            // set loading true ( store we are busy ) and show status "loading"
            set({ loading: true, status: "loading" })

            // call login from myAuthService with email and password
            //await = wait for server to response before moving on
            // data = what server send back ( token + user info)
            const data = await myAuthService.login({ email, password})

            // save to stroage bcz- hydarte() read it when app opens to check logged in? so no need of login again
            storage.set(KEYS.TOKEN, data.accessToken)
            storage.set(KEYS.REFRESH, data.refreshToken)
            storage.set(KEYS.USER, JSON.stringify(data.user) )
            // here we use JSON.stringify to convert OBJECT into string bcz - data always store in text 

            set({
                token: data.accessToken,
                refreshToken: data.refreshToken,
                user: data.user,
                status: "authenticated",
                loading: false,
            })

            
        // here catch (error) has 2 job
        // 1. "something went wrong" go back to normal, stop loading spinner, status back to idle
        // 2. throw error- screen show error message
        } catch (error) {
            set({ status: "idle", loading: false})
            throw error
        }
    },

    // clearSession = LOGOUT FUNCTION
    // when user taps "logout" - it will remove token, refreshToken, user from stroage
    clearSession: () => {
    // remove from phone storage
    storage.remove(KEYS.TOKEN)
    storage.remove(KEYS.REFRESH)
    storage.remove(KEYS.USER)

    // here values are null and "idle", bcz- token, refreshToken, user are removed from stoage
    set({
        token: null,
        refreshToken: null,
        user: null,
        status: "idle",
    })
 },

 // HYDRATE FUNCTION
    // runs when app opens
    // checks if user was already logged in

    hydrate: () => {
        // read saved values form phone storage
        const token = storage.getString(KEYS.TOKEN)
        const refreshToken = storage.getString(KEYS.REFRESH)
        const userStr = storage.getString(KEYS.USER)

        // if all 3 exist → user was logged in before!
        if (token && refreshToken && userStr) {
            set({
                token,
                refreshToken,
                user:JSON.parse(userStr),
                status: "authenticated",
            })
        }

        // mark as checked whether logged in or not
        set({ hydrated: true})
    },
}))

