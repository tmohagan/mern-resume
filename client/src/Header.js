import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const username = userInfo?.username;

  useEffect(() => {
    if (username) { 
      fetch(`${process.env.REACT_APP_API_URL}/profile`, { credentials: "include" })
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              setUserInfo(null);
              throw new Error("Unauthorized");
            }
            throw new Error(`Profile fetch failed: ${response.status}`);
          }
          return response.json();
        })
        .then(setUserInfo)
        .catch(error => {
          console.error("Profile error:", error.message); 
        });
    }
  }, [username]);

  const logout = async () => { 
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        credentials: "include",
        method: "POST",
      });
      setUserInfo(null);
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header>
      <Link to="/" className="logo">tim-ohagan.com</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">create new post</Link>
            <button onClick={logout}>logout ({username})</button>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">login</Link>
            <Link to="/register">register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
