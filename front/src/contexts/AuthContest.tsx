import { createContext, useState } from "react";

export const AuthContext = createContext({} as any)

export function AuthProvider({children}: {children:  React.ReactNode}) {
    const [signedIn, setIsSignedIn] = useState(false)
    
    return(
        <AuthContext.Provider value={{ signedIn, setIsSignedIn }}>
            {children}
        </AuthContext.Provider>
    )
}