import React, { useState } from "react";
import axios from "axios";

const EditPost = ({ postId, initialContent, initialTag, onEditSuccess }) => {
  const [content, setContent] = useState(initialContent);
  const [tag, setTag] = useState(initialTag);
  const [message, setMessage] = useState("");

  const handleEdit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axios.put("http://localhost:5000/questions/edit", {
        question_id: postId,
        user_id: user.email,
        content,
        tag,
      });
      setMessage(response.data.message);
      onEditSuccess(); // Callback to refresh the list after editing
    } catch (error) {
      console.error("Error editing post:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "Error editing post");
    }
  };

  return (
    <form onSubmit={handleEdit} style={styles.form}>
      <h3 style={styles.title}>Edit Post</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        placeholder="Edit your content..."
        style={styles.textarea}
      ></textarea>
      <input
        type="text"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        required
        placeholder="Edit tag"
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Update</button>
      {message && <p style={styles.message}>{message}</p>}
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Roboto', sans-serif",
  },
  title: {
    fontSize: "1.5em",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    height: "100px",
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1em",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "center",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  message: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "0.9em",
    color: "#28a745",
  },
};

export default EditPost;

