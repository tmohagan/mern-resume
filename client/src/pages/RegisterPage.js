import { useState } from "react";
import { Navigate } from "react-router-dom";
import api from '../api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function register(ev) {
    ev.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage('passwords do not match');
      return;
    }
  
    try {
      await api.post('/register', { username, password, confirmPassword });
      alert('registration successful');
      setRedirect(true);
    } catch (error) {
      console.log('Error registering:', error);
      setErrorMessage(error.response?.data?.details || 'an error occurred during registration');
    }
  }

  if (redirect) {
    return <Navigate to={'/login'} />;
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>

      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input 
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)} 
      />
      <input 
        type="password"
        placeholder="confirm password"
        value={confirmPassword}
        onChange={(ev) => setConfirmPassword(ev.target.value)} 
      />

      {errorMessage && <div className="error-message">{errorMessage}</div>} 

      <button type="submit">Register</button>
    </form>
  );
}
