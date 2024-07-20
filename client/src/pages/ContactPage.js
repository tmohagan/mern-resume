import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [buttonText, setButtonText] = useState("Send");
  const navigate = useNavigate();

  const handleChange = (ev) => {
    setFormData({ ...formData, [ev.target.name]: ev.target.value });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setButtonText("sending...");
    try {
      await api.post('/contact', formData);
      navigate("/");
    } catch (error) {
      alert("An error occurred while sending the message.");
      console.error(error);
    } finally {
      setButtonText("send");
    }
  };

  return (
    <div className="contact-page">
      <form className="contact" onSubmit={handleSubmit}>
        <h1>Contact Me</h1>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          className="message-input"
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">{buttonText}</button>
      </form>
      <ContactInfo />
    </div>
  );
}

const ContactInfo = () => (
  <div>
    <div className="contact-info">
      <p>
        Email: <a href="mailto:tmohagan@gmail.com" className="contact-link">tmohagan@gmail.com</a>
      </p>
      <p>
        Phone: <a href="tel:+17732701142" className="contact-link">(773) 270-1142</a>
      </p>
      <p>
        LinkedIn:{" "}
          <a href="https://www.linkedin.com/in/timothy-ohagan/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link">
            linkedin.com/in/timothy-ohagan/
          </a>
      </p>
      <p>
        Website:{" "}
          <a href="https://www.tim-ohagan.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-link">
            tim-ohagan.com
          </a>
      </p>
      <p>
        GitHub:{" "}
          <a href="https://github.com/tmohagan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-link">
            github.com/tmohagan
          </a>
      </p>
    </div>
  </div>
);