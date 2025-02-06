import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingQuestions = () => {
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPendingQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/questions/pending/${user.email}`);
        setPendingQuestions(response.data.pending_questions);
      } catch (error) {
        console.error("Error fetching pending questions:", error);
      }
    };
    fetchPendingQuestions();
  }, [user.email]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Pending Questions</h2>
      {pendingQuestions.length > 0 ? (
        pendingQuestions.map((q) => (
          <div key={q._id} style={styles.questionCard}>
            <p style={styles.questionContent}><strong>Question:</strong> {q.content}</p>
            <p style={styles.questionTag}><strong>Tag:</strong> {q.tag}</p>
          </div>
        ))
      ) : (
        <p style={styles.noQuestions}>No pending questions found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  questionCard: {
    backgroundColor: "#fff",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  questionContent: {
    fontSize: "1.1rem",
    color: "#444",
    marginBottom: "10px",
  },
  questionTag: {
    fontSize: "1rem",
    color: "#666",
    fontStyle: "italic",
  },
  noQuestions: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#888",
  },
  // Responsive Styles
  "@media (max-width: 768px)": {
    container: {
      padding: "15px",
    },
    heading: {
      fontSize: "1.5rem",
    },
    questionCard: {
      padding: "12px",
    },
    questionContent: {
      fontSize: "1rem",
    },
  },
};

export default PendingQuestions;
