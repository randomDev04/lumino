// importing useMyAuthStore from store (where all data store), hook will use this when screen needs 
import { useMyAuthStore } from "../store/myAuth.store";

// HOOK FUNCTION
export function useMyAuth () { // takes whats screen needs from screen and return it 
    
    // how to pick from store
    const login = useMyAuthStore((s) => s.login)  //login function
    const logout = useMyAuthStore((s) => s.clearSession)  //logout function
    const status = useMyAuthStore((s) => s.status)  // pick only status
    const user = useMyAuthStore((s) => s.user)  //  pick user details
    const token = useMyAuthStore((s) => s.token)  // pick only token

    return {
        login,  // login function for screen to  use
        user,  // user function return user info from stroage
        token, // return token number that is saved in stroage
        isAuthenticated: !!token,  // check token exist? true/false
        loading: status === "loading",  // strict valid === that status is loading
        logout, // logout function for screen to use
    }
}