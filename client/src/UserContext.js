// UserContext.js
import { createContext, useState, useEffect, useCallback } from "react";
import api from './api';

export const UserContext = createContext(null);

export function UserContextProvider({children}) {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const checkUserProfile = useCallback(async () => {
    if (userInfo?.username) {
      try {
        const response = await api.get('/profile');
        setUserInfo(response.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUserInfo(null);
          localStorage.removeItem('userInfo');
        }
        console.error("Profile error:", error);
      }
    }
  }, [userInfo?.username]);

  useEffect(() => {
    if (userInfo?.username && !userInfo?.name) {
      checkUserProfile();
    }
  }, [userInfo?.username, userInfo?.name, checkUserProfile]);

  const logout = useCallback(() => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  }, []);

  const value = {
    userInfo,
    setUserInfo: (info) => {
      setUserInfo(info);
      if (info) {
        localStorage.setItem('userInfo', JSON.stringify(info));
      } else {
        localStorage.removeItem('userInfo');
      }
    },
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}