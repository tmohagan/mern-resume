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
    <div>
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
      <div className="contact-info">
        <p>Email: <a href="mailto:tmohagan@gmail.com">tmohagan@gmail.com</a></p>
        <p>Phone: <a href="tel:+17732701142">(773) 270-1142</a></p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/timothy-ohagan/" target="_blank" rel="noopener noreferrer">linkedin.com/in/timothy-ohagan/</a></p>
        <p>Website: <a href="https://www.tim-ohagan.com" target="_blank" rel="noopener noreferrer">tim-ohagan.com</a></p>
        <p>GitHub: <a href="https://github.com/tmohagan" target="_blank" rel="noopener noreferrer">github.com/tmohagan</a></p>
      </div>
    </div>
  );
  
}
