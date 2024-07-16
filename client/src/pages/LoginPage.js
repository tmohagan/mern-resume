import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  const login = async (ev) => {  
    ev.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        setRedirect(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "wrong credentials");
      }
    } catch (error) {
      alert("an error occurred. please try again.");
      console.error(error);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input 
        type="text" 
        placeholder="username" 
        value={username} 
        onChange={(ev) => setUsername(ev.target.value)} 
      />
      <input 
        type="password" 
        placeholder="password" 
        value={password} 
        onChange={(ev) => setPassword(ev.target.value)} 
      />
      <button>Login</button>
      <p>Don't have an account? <Link to="/register">Register here</Link></p> 
    </form>
  );
}
