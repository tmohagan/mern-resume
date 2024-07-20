import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import api from '../api';

export default function AccountPage() {
  const [redirect, setRedirect] = useState(false);
  const { userInfo } = useContext(UserContext);
  const [name, setName] = useState(userInfo?.name || "");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userInfo?.id) {
        try {
          const response = await api.get(`/user/${userInfo.id}`);
          setName(response.data.name);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUserData();
  }, [userInfo]);

  async function updateProfile(ev) {
    ev.preventDefault();
    
    try {
      await api.put('/user', {
        name,
        id: userInfo.id.toString(),
      });
      setRedirect(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    } 
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={updateProfile}>
      <h1>{userInfo?.username} Profile</h1>
      <label htmlFor="nameInput">Full Name:</label>
      <input
        type="text"
        id="nameInput"
        placeholder="Name"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <button type="submit" style={{ marginTop: "5px" }}>
        Update Profile
      </button>
    </form>
  );
}
