import { createContext, useState, useEffect } from "react";
import api from './api';

export const UserContext = createContext(null);

export function UserContextProvider({children}) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (userInfo?.username) {
        try {
          const response = await api.get('/profile');
          setUserInfo(response.data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            setUserInfo(null);
          }
          console.error("Profile error:", error);
        }
      }
    };

    checkUserProfile();
  }, [userInfo?.username]);

  return (
    <UserContext.Provider value={{userInfo, setUserInfo}}>
      {children}
    </UserContext.Provider>
  );
}