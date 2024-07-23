// LoginPage.js
import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import api from '../api';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  const login = async (ev) => {
    ev.preventDefault();
    try {
      const response = await api.post('/login', { username, password });
      setUserInfo({
        id: response.data.id,
        username: response.data.username,
        name: response.data.name, // Ensure the backend sends the name
        // Include any other relevant user data
      });
      setRedirect(true);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
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