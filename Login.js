import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user)); // Save user data
      setMessage("Login successful!");
      navigate("/questions"); // Navigate to the feed page
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "Error during login");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login Page</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {message && <p style={message.includes("successful") ? styles.success : styles.error}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "100%",
    marginTop: "80px", // Ensures space from navbar
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Roboto', sans-serif",
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
    minHeight: "100vh", // Ensures content stays within the window height
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
    maxWidth: "400px", // Max width to avoid stretching on large screens
    boxSizing: "border-box",
    resize: "none", // Disable resizing for input fields
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
  // Responsive Styles
  '@media (max-width: 768px)': {
    container: {
      padding: "15px",
      marginTop: "120px", // Adjusted for smaller screens
    },
    title: {
      fontSize: "1.5em",
    },
    form: {
      gap: "10px",
    },
    input: {
      fontSize: "0.9em",
    },
    button: {
      fontSize: "1em",
    },
  },
};

export default Login;










