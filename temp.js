import { useNavigate } from "react-router-dom";

export default function Header() {
  // ... (rest of the code)

  const navigate = useNavigate();

  const logout = async () => { 
    try {
      // ... (your existing logout logic)

      // Redirect using navigate
      navigate("/"); 
    } catch (error) {
      // ... (error handling)
    }
  };

  // ... (rest of the code)
}
