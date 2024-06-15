import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [buttonText, setButtonText] = useState('send');
  

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setButtonText('sending...');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contact`, {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        alert("failed to send message");
      }
    } catch (error) {
      alert("an error occurred while sending the message.");
      console.error(error);
    } finally {
      setButtonText('send');
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form className="contact" onSubmit={handleSubmit}>
      <h1>contact me</h1>
      <input
        type="text"
        placeholder="your name"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
        required
      />
      <input
        type="email"
        placeholder="your email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        required
      />
      <textarea
        className="message-input"
        placeholder="your message"
        value={message}
        onChange={(ev) => setMessage(ev.target.value)}
        required
      />
      <button type="submit">{buttonText}</button>
    </form>
  );
}
