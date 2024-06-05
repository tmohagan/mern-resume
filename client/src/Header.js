import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Could not fetch user profile. Status: ${response.status}`);
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        if (error.message.includes("Unauthorized")) {
          setUserInfo(null);
        }
      }
    };

    fetchProfile();
  }, []); // Empty dependency array ensures it runs only once after initial render

  function logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: "include",
      method: "POST",
    }).catch(error => console.error("Logout error:", error));

    setUserInfo(null);
    localStorage.removeItem("token");
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">tim-ohagan.com</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">create new post</Link>
            <button onClick={logout}>Logout ({username})</button>
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
