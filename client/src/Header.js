import {Link, useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const username = userInfo?.username;
  const navigate = useNavigate();

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

  const logout = async (event) => {
    event.preventDefault(); // Prevent default link behavior
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        credentials: "include",
        method: "POST",
      });
      setUserInfo(null);
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header>
      <Link to="/" className="logo">tim-ohagan.com</Link>
      <nav>
        {username ? (
          <>
            <Link to="/posts_index">skills</Link>
            <Link to="/projects_index">projects</Link>
            <Link to="/contact">contact</Link>
            <Link to="/account">my profile</Link>
            <Link to="/" onClick={logout}>logout</Link>
          </>
        ) : (
          <>
            <Link to="/posts_index">posts</Link>
            <Link to="/projects_index">projects</Link>
            <Link to="/contact">contact</Link>
            <Link to="/login">login</Link>
          </>
        )}
      </nav>
    </header>
  );
}