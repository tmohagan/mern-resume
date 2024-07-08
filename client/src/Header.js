import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const username = userInfo?.username;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    event.preventDefault();
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <Link to="/" className="logo">tim-ohagan.com</Link>
      <div className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
        {username ? (
          <>
            <Link to="/posts_index" onClick={toggleMenu}>skills</Link>
            <Link to="/projects_index" onClick={toggleMenu}>projects</Link>
            <Link to="/contact" onClick={toggleMenu}>contact</Link>
            <Link to="/account" onClick={toggleMenu}>my profile</Link>
            <Link to="/" onClick={logout}>logout</Link>
          </>
        ) : (
          <>
            <Link to="/posts_index" onClick={toggleMenu}>posts</Link>
            <Link to="/projects_index" onClick={toggleMenu}>projects</Link>
            <Link to="/contact" onClick={toggleMenu}>contact</Link>
            <Link to="/login" onClick={toggleMenu}>login</Link>
          </>
        )}
      </nav>
    </header>
  );
}