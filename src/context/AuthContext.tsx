
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

// Define types for our authentication context
type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demonstration
const DEMO_USERS = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@solar.com",
    password: "solar123",
    role: "user" as const,
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@solar.com",
    password: "admin123",
    role: "admin" as const,
  },
];

// Provider component that wraps your app and makes auth available
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to hold the authenticated user's info
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("solarUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Check if any user is logged in
  const isAuthenticated = !!user;

  // Function to handle user login
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to your backend
    // For demo purposes, we're checking against our hardcoded users
    
    // First check saved users from localStorage
    const savedUsersString = localStorage.getItem("solarUsers");
    const savedUsers = savedUsersString ? JSON.parse(savedUsersString) : [];
    const allUsers = [...DEMO_USERS, ...savedUsers];
    
    const foundUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      // Create a user object without the password
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      
      // Save to state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem("solarUser", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("solarUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  // Function to handle user signup
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if email already exists
    const savedUsersString = localStorage.getItem("solarUsers");
    const savedUsers = savedUsersString ? JSON.parse(savedUsersString) : [];
    const allUsers = [...DEMO_USERS, ...savedUsers];
    
    const userExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userExists) {
      toast({
        title: "Signup failed",
        description: "This email is already registered. Please use a different email or try logging in.",
        variant: "destructive",
      });
      return false;
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role: "user" as const,
    };
    
    // Save to localStorage
    savedUsers.push(newUser);
    localStorage.setItem("solarUsers", JSON.stringify(savedUsers));
    
    // Log the user in
    const userWithoutPassword = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    
    setUser(userWithoutPassword);
    localStorage.setItem("solarUser", JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Account created",
      description: "Your account has been created successfully. Welcome!",
    });
    
    return true;
  };

  // Create the context value object
  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
  };

  // Provide the context value to children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
