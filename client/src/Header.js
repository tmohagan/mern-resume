import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not fetch user profile.');
        }
        return response.json();
      })
      .then(setUserInfo)
      .catch(error => {
        console.error(error); 
        if (error.message.includes('Unauthorized')) {
          setUserInfo(null); // Clear userInfo if unauthorized
        } 
      });
  }, [setUserInfo]);

  function logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    localStorage.removeItem('token');
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
