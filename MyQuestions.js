import React, { useEffect, useState } from "react";
import axios from "axios";
import EditPost from "./EditPost";
import DeleteButton from "./DeleteButton";

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMyQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/questions/pending/${user.email}`);
        setQuestions(response.data.pending_questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchMyQuestions();
  }, [user.email]);

  const refreshQuestions = () => {
    const fetchMyQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/questions/pending/${user.email}`);
        setQuestions(response.data.pending_questions);
      } catch (error) {
        console.error("Error refreshing questions:", error);
      }
    };

    fetchMyQuestions();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Pending Questions</h2>
      {questions.length > 0 ? (
        <div style={styles.grid}>
          {questions.map((q) => (
            <div key={q._id} style={styles.card}>
              <p style={styles.questionText}>
                <strong>Question:</strong> {q.content}
              </p>
              <p style={styles.tagText}>
                <strong>Tag:</strong> {q.tag}
              </p>
              <div style={styles.actions}>
                <button onClick={() => setEditingPostId(q._id)} style={styles.editButton}>
                  Edit
                </button>
                <DeleteButton postId={q._id} onDeleteSuccess={refreshQuestions} />
              </div>
              {editingPostId === q._id && (
                <EditPost
                  postId={q._id}
                  initialContent={q.content}
                  initialTag={q.tag}
                  onEditSuccess={() => {
                    setEditingPostId(null);
                    refreshQuestions();
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noQuestions}>No pending questions found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    minHeight: "400px", // Minimum height to visualize layout
    border: "1px solid #ccc", // Debugging: Visible border
    marginTop: "80px", // Adjust to navbar height if fixed
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontSize: "1.8em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    boxSizing: "border-box",
  },
  card: {
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    border: "1px solid #007bff", // Debugging: Card border marker
    boxSizing: "border-box",
  },
  questionText: {
    fontSize: "1.1em",
    color: "#555",
  },
  tagText: {
    fontSize: "0.9em",
    color: "#007bff",
    marginBottom: "10px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  noQuestions: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    marginTop: "20px",
  },

  // Responsive Styling
  "@media (max-width: 768px)": {
    container: {
      padding: "15px",
      marginTop: "100px", // Adjust for smaller screens
    },
    title: {
      fontSize: "1.4em",
    },
    grid: {
      gridTemplateColumns: "1fr", // Single column for mobile
      gap: "10px",
    },
    card: {
      padding: "12px",
    },
    questionText: {
      fontSize: "1em",
    },
    actions: {
      flexDirection: "column", // Stack buttons vertically
      alignItems: "center",
    },
    editButton: {
      fontSize: "0.9em",
      padding: "6px 12px",
    },
  },
};

export default MyQuestions;



