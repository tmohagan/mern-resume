import {Link, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const username = userInfo?.username;
  const navigate = useNavigate();

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLinkClick = () => {
    setActiveDropdown(null);
  };


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
    setActiveDropdown(null); 
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
        {username && (
        <>
        <div className={`dropdown ${activeDropdown === 'posts' ? 'active' : ''}`}>
          <button className="dropdown-toggle" onClick={() => handleDropdownToggle('posts')}>
            posts
          </button>
          {activeDropdown === 'posts' && (
            <div className="dropdown-menu">
              <div>
              <Link to="/posts_index" onClick={handleLinkClick}>view posts</Link>
              <Link to="/create_post" onClick={handleLinkClick}>create post</Link>
              </div>
            </div>
          )}
        </div>
        <div className={`dropdown ${activeDropdown === 'projects' ? 'active' : ''}`}>
          <button className="dropdown-toggle" onClick={() => handleDropdownToggle('projects')}>
            projects
          </button>
          {activeDropdown === 'projects' && (
            <div className="dropdown-menu">
              <div>
              <Link to="/projects_index" onClick={handleLinkClick}>view projects</Link>
              <Link to="/create_project" onClick={handleLinkClick}>create project</Link>
              </div>
            </div>
          )}
        </div>
        <div className={`dropdown ${activeDropdown === 'contact' ? 'active' : ''}`}>
          <button className="dropdown-toggle" onClick={() => handleDropdownToggle('contact')}>
            contact
          </button>
          {activeDropdown === 'contact' && (
            <div className="dropdown-menu">
              <div>
              <Link to="/contact" onClick={handleLinkClick}>contact me</Link>
              </div>
            </div>
          )}
        </div>
        <div className={`dropdown ${activeDropdown === 'account' ? 'active' : ''}`}>
          <button className="dropdown-toggle" onClick={() => handleDropdownToggle('account')}>
            my account
          </button>
          {activeDropdown === 'account' && (
            <div className="dropdown-menu">
              <div>
              <Link to="/account" onClick={handleLinkClick}>my profile ({username})</Link>
              <button onClick={logout} className="link-button">logout</button> 
              </div>
            </div>
          )}
        </div>
        </>
        )}
        {!username && (
        <>
        <div className={`dropdown ${activeDropdown === 'posts' ? 'active' : ''}`}>
          <button className="dropdown-toggle" onClick={() => handleDropdownToggle('posts')}>
            posts
          </button>
          {activeDropdown === 'posts' && (
            <div className="dropdown-menu">
              <div>
              <Link to="/posts_index" onClick={handleLinkClick}>view posts</Link>
              </div>
            </div>
          )}
        </div>
        <div className={`dropdown ${activeDropdown === 'projects' ? 'active' : ''}`}>
          <button className="dropdown-toggle" onClick={() => handleDropdownToggle('projects')}>
            projects
          </button>
          {activeDropdown === 'projects' && (
            <div className="dropdown-menu">
              <div>
              <Link to="/projects_index" onClick={handleLinkClick}>view projects</Link>
              </div>
            </div>
          )}
        </div>
        <div className={`dropdown ${activeDropdown === 'contact' ? 'active' : ''}`}>
          <button className="dropdown-toggle" onClick={() => handleDropdownToggle('contact')}>
            contact
          </button>
          {activeDropdown === 'contact' && (
            <div className="dropdown-menu">
              <div>
              <Link to="/contact" onClick={handleLinkClick}>contact me</Link>
              </div>
            </div>
          )}
        </div>
        <div className={`dropdown ${activeDropdown === 'account' ? 'active' : ''}`}>
          <button className="dropdown-toggle" onClick={() => handleDropdownToggle('account')}>
            my account
          </button>
          {activeDropdown === 'account' && (
            <div className="dropdown-menu">
              <div>
              <Link to="/login" onClick={handleLinkClick}>login</Link>
              <Link to="/register" onClick={handleLinkClick}>register</Link>
              </div>
            </div>
          )}
        </div>
        </>
        )}
      </nav>
    </header>
  );
}
