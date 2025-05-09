"use client";

import { User, getCurrentUser, isAuthenticated, logout } from "@/lib/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = isAuthenticated();
        setAuthenticated(auth);

        if (auth) {
          const userData = getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        // Em caso de erro com o token ou localStorage
        console.error("Erro ao verificar autenticação:", error);
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Verificar no caso de mudanças no localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  const value = {
    user,
    authenticated,
    loading,
    logout,
    setUser: updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }

  return context;
};
