import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
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
