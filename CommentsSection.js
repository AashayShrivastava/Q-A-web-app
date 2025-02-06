import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/comments/${postId}`);
        const sortedComments = response.data.comments.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setComments(sortedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setMessage("You must be logged in to comment.");
      return;
    }

    if (!commentContent.trim()) {
      setMessage("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/comments", {
        post_id: postId,
        user_id: user.email,
        content: commentContent,
      });
      setMessage(response.data.message);
      setCommentContent("");

      const commentsResponse = await axios.get(`http://localhost:5000/comments/${postId}`);
      const sortedComments = commentsResponse.data.comments.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
      setMessage("Error adding comment.");
    }
  };

  return (
    <div style={styles.commentSection}>
      <h4 style={styles.commentTitle}>Comments</h4>

      {comments.map((comment) => (
        <div key={comment._id} style={styles.comment}>
          <p>
            <strong>{comment.user_id}:</strong> {comment.content}
          </p>
          <p style={styles.commentDate}>
            {new Date(comment.created_at).toLocaleString()}
          </p>
        </div>
      ))}

      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        style={styles.textarea}
      />
      <button onClick={handleAddComment} style={styles.addButton}>
        Add Comment
      </button>
      {message && <p style={styles.error}>{message}</p>}
    </div>
  );
};

// Styles object
const styles = {
  commentSection: {
    marginTop: "80px", // Adjust for navbar overlap
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    maxWidth: "900px",
    margin: "20px auto", // Center the content
    boxSizing: "border-box",
  },
  commentTitle: {
    fontSize: "1.2em",
    marginBottom: "15px",
    color: "#333",
  },
  comment: {
    marginBottom: "15px",
    padding: "12px",
    backgroundColor: "#f0f8ff",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  commentDate: {
    fontSize: "0.8em",
    color: "#777",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    height: "auto",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgb(204, 204, 204)",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px inset",
    resize: "vertical", // Allow vertical resizing only
    boxSizing: "border-box",
  },
  addButton: {
    padding: "8px 15px",
    fontSize: "1em",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },

  // Responsive Styling
  "@media (max-width: 768px)": {
    commentSection: {
      marginTop: "100px", // Adjust for mobile
      padding: "15px",
    },
    commentTitle: {
      fontSize: "1.1em",
    },
    comment: {
      padding: "10px",
    },
    textarea: {
      fontSize: "0.9em",
      minHeight: "80px",
    },
    addButton: {
      fontSize: "1rem",
    },
  },
};

export default CommentsSection;





