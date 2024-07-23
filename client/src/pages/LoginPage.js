// LoginPage.js
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import api from '../api';

export default function LoginPage() {
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const login = async (ev) => {
    ev.preventDefault();
    try {
      const response = await api.post('/login', { username, password });
      setUserInfo(response.data.user);
      // If the server didn't set a cookie, store the token in localStorage
      if (!document.cookie.includes('token=')) {
        localStorage.setItem('token', response.data.token);
      }
      navigate('/');
    } catch (error) {
      alert("Login failed");
    }
  };

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