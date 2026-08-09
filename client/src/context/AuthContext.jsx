import { createContext, useContext, useEffect, useState } from "react";

import {
  changePassword as changePasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/authApi.js";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await getCurrentUser();

        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    setUser(response.data.user);

    return response;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);

    return response;
  };

  const logout = async () => {
    const response = await logoutUser();

    setUser(null);

    return response;
  };

  const changePassword = async (passwordData) => {
    const response = await changePasswordRequest(passwordData);

    setUser(null);

    return response;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
