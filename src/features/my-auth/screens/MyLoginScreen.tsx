// Custom Hook - give login function + loading state (useMyAuth.ts)
import { useMyAuth } from "../hooks/useMyAuth";

// useState - help to remember values that change on screen
import { useState } from "react";

// Basic UI building blocks from React Native


export default function MyLoginScreen() {
    // from hook (useMyAuth.ts) we only pick login function, loading state, isAuthenticated
    const { login, loading, isAuthenticated} = useMyAuth();

    // useSate for inputs

    // remember what user type in email box
    const [ email, setEmail ] = useState("")

    // remember what user type in password box
    const [ password, setPassword ] = useState("")

    // remember error message to show user
    const [ errorMessage, setErrorMessage ] = useState("")

    // validate funtion - check input before calling API
    const validate = () => {

        //check if email is empty
        if (!email.trim()) {
            setErrorMessage("Email is Required")
            return false
        }
    }

}

