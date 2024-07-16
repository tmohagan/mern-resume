import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(false);
  const { userInfo } = useContext(UserContext);
  const [name, setName] = useState(userInfo?.name || "");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userInfo?.id) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userInfo.id}`);
          if (response.ok) {
            const data = await response.json();
            setName(data.name);
          } else {
            console.error("Error fetching user data:", response.status, response.statusText);
          }
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          id: userInfo.id.toString(),
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.error("Error updating profile:", response.status, response.statusText);
      }
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
