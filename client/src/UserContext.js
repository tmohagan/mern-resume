// UserContext.js
import { createContext, useState, useEffect, useCallback } from "react";
import api from './api';

export const UserContext = createContext(null);

export function UserContextProvider({children}) {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [profileChecked, setProfileChecked] = useState(false);

  const checkUserProfile = useCallback(async () => {
    if (userInfo?.username) {
      try {
        const response = await api.get('/profile');
        setUserInfo(prevInfo => ({
          ...prevInfo,
          ...response.data
        }));
        localStorage.setItem('userInfo', JSON.stringify(response.data));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUserInfo(null);
          localStorage.removeItem('userInfo');
        }
        console.error("Profile error:", error);
      } finally {
        setProfileChecked(true);
      }
    }
  }, [userInfo?.username]);

  useEffect(() => {
    if (userInfo?.username && !profileChecked) {
      checkUserProfile();
    }
  }, [userInfo?.username, profileChecked, checkUserProfile]);

  const logout = useCallback(() => {
    setUserInfo(null);
    setProfileChecked(false);
    localStorage.removeItem('userInfo');
  }, []);

  const value = {
    userInfo,
    setUserInfo: (info) => {
      setUserInfo(info);
      setProfileChecked(false);
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