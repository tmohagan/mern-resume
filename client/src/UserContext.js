// UserContext.js
import { createContext, useState, useEffect } from "react";
import api from './api';

export const UserContext = createContext(null);

export function UserContextProvider({children}) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshToken = async () => {
    try {
      setIsLoading(true);
      // Try to get token from localStorage if it's not in the cookie
      const storedToken = localStorage.getItem('token');
      const response = await api.post('/refresh-token', { token: storedToken });
      setUserInfo(response.data.user);
      // If the server didn't set a cookie, store the token in localStorage
      if (!document.cookie.includes('token=')) {
        localStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      setUserInfo(null);
      localStorage.removeItem('token');
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      setUserInfo(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        await refreshToken();
        const intervalId = setInterval(refreshToken, 14 * 60 * 1000);
        return () => clearInterval(intervalId);
      } else {
        setUserInfo(null);
      }
      setIsLoading(false);
    };
  
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, refreshToken, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}