import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import api from './api';

export default function Header() {
  const { userInfo, setUserInfo, logout } = useContext(UserContext);
  const username = userInfo?.username;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (username) {
      api.get('/profile')
        .then(response => {
          setUserInfo(response.data);
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            setUserInfo(null);
          }
          console.error("Profile error:", error);
        });
    }
  }, [username, setUserInfo]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/');
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
            <Link to="/posts_index" onClick={toggleMenu}>Skills</Link>
            <Link to="/projects_index" onClick={toggleMenu}>Projects</Link>
            <Link to="/contact" onClick={toggleMenu}>Contact</Link>
            <Link to="/search" onClick={toggleMenu}>Search</Link>
            <Link to="/account" onClick={toggleMenu}>My Profile</Link>
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </>
        ) : (
          <>
            <Link to="/posts_index" onClick={toggleMenu}>Skills</Link>
            <Link to="/projects_index" onClick={toggleMenu}>Projects</Link>
            <Link to="/contact" onClick={toggleMenu}>Contact</Link>
            <Link to="/search" onClick={toggleMenu}>Search</Link>
            <Link to="/login" onClick={toggleMenu}>Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}