// Custom Hook - give login function + loading state (useMyAuth.ts)
import { useMyAuth } from "../hooks/useMyAuth";

// useState - help to remember values that change on screen
import { useState } from "react";

// Basic UI building blocks from React Native
import { Button, Text, TextInput, View } from "react-native";


export default function MyLoginScreen() {
    // from hook (useMyAuth.ts) we only pick login function, loading state, isAuthenticated
    const { login, loading, isAuthenticated} = useMyAuth();

    // useState for inputs

    // remember what user type in email box
    const [ email, setEmail ] = useState("")

    // remember what user type in password box
    const [ password, setPassword ] = useState("")

    // remember error message to show user
    const [ errorMessage, setErrorMessage ] = useState("")

    // validate function - check input before calling API
    const validate = () => {

        //check if email is empty
        if (!email.trim()) {
            setErrorMessage("Email is Required")
            return false
        }

        // check if password is empty
        if (!password) {
            setErrorMessage("Password is Required")
            return false
        }

        // all good!
        return true
    }


    // handle login- runs when user taps login button
    const handleLogin = async () => {

        // step 1: check input first
        if (!validate()) return  // stop if invalid!

        // step 2: try calling login
        try {
            // call login with email and password
            await login(email, password)
        } catch (error: any) {  // something went wrong - show error message to user 
            setErrorMessage(error.message || "Something went wrong")
        }
    }

    return (
        // background color added so screen is visible!
        <View style={{ flex: 1, backgroundColor: '#f0f0f0', padding: 20 }}>
            
            {/* Title */}
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 }}>
                My Login Screen 🎉
            </Text>

            {/* Email Input */}
            <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 8 }}
            />

            {/* Password Input */}
            <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 8 }}
            />

            {/* for error message if exists */}
            { errorMessage ? 
                <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> 
                : null 
            }

            {/* Login button */}
            <Button
                title="Login"
                onPress={handleLogin}
            />

            {/* shows loading while logging in */}
            {loading ? 
                <Text style={{ textAlign: 'center', marginTop: 10 }}>Loading...</Text> 
                : null
            }

        </View>
    )
}