import React, { useState } from "react";
import axios from "axios";

const PostQuestion = () => {
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve the user object from localStorage
    const userId = user?.email; // Use email as user_id (or another unique field)

    if (!userId) {
      setMessage("User is not logged in.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/questions", {
        user_id: userId,
        content,
        tag,
      });
      setMessage(response.data.message);
      setContent("");
      setTag("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Error posting question");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Post a Question</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          placeholder="Enter your question"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={styles.textarea}
        ></textarea>
        <input
          type="text"
          placeholder="Enter a tag (e.g., finance)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>Submit</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "80px auto", // Added margin-top to avoid overlap with navbar
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box", // Ensures padding doesn't affect layout
    minHeight: "calc(100vh - 80px)", // Ensures content stays within screen height
  },
  heading: {
    textAlign: "center",
    color: "#333",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical", // Allow only vertical resizing
    minHeight: "100px",
    boxSizing: "border-box",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  submitButton: {
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    backgroundColor: "#45a049",
  },
  message: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#444",
    marginTop: "15px",
  },
  // Responsive Styling
  "@media (max-width: 768px)": {
    container: {
      padding: "15px",
      marginTop: "120px", // Adjusted for smaller screens
    },
    heading: {
      fontSize: "1.5rem",
    },
    form: {
      gap: "10px",
    },
    textarea: {
      fontSize: "0.9rem",
      minHeight: "80px",
    },
    input: {
      fontSize: "0.9rem",
    },
    submitButton: {
      fontSize: "1rem",
    },
  },
};

export default PostQuestion;



