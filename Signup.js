import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if email is valid
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    // Ensure all fields are filled
    if (!username.trim() || !email.trim() || !password.trim()) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {
        username,
        email,
        password,
      });
      setMessage(response.data.message || "Signup successful!");
    } catch (error) {
      setMessage(error.response?.data?.error || "Error during signup");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Signup Page</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Signup
        </button>
      </form>
      {message && (
        <p style={message.includes("successful") ? styles.success : styles.error}>
          {message}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "100%",
    marginTop: "80px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Roboto', sans-serif",
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
    minHeight: "100vh",
  },
  title: {
    fontSize: "1.8em",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    padding: "10px",
    fontSize: "1em",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
    width: "80%",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 15px",
    fontSize: "1.1em",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    width: "80%",
    maxWidth: "400px",
  },
  success: {
    color: "green",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default Signup;






