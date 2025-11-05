import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id_usuario: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  signedIn: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setSignedIn(true);
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    setSignedIn(true);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSignedIn(false);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        signedIn,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}
