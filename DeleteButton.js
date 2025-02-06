import React from "react";
import axios from "axios";

const DeleteButton = ({ postId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await axios.delete("http://localhost:5000/questions/delete", {
          data: { question_id: postId, user_id: user.email },
        });
        alert(response.data.message);
        onDeleteSuccess(); // Callback to refresh the list after deleting
      } catch (error) {
        console.error("Error deleting post:", error.response?.data || error.message);
        alert("Error deleting post");
      }
    }
  };

  return (
    <button style={styles.deleteButton} onClick={handleDelete}>
      Delete
    </button>
  );
};

const styles = {
  deleteButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9em",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  deleteButtonHover: {
    backgroundColor: "#c82333",
    transform: "scale(1.05)",
  },
};

export default DeleteButton;

