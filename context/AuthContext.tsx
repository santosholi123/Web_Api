"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("auth_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, call backend API
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockUser: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName: email.split("@")[0],
    };

    setUser(mockUser);
    localStorage.setItem("auth_user", JSON.stringify(mockUser));
  };

  const register = async (fullName: string, email: string, password: string) => {
    // Mock register - in real app, call backend API
    if (!fullName || !email || !password) {
      throw new Error("All fields are required");
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockUser: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName,
    };

    setUser(mockUser);
    localStorage.setItem("auth_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
