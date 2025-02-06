import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch pending questions from the backend
  useEffect(() => {
    const fetchPendingQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/questions");
        setPendingQuestions(response.data.pending_questions);
      } catch (error) {
        console.error("Error fetching pending questions:", error);
      }
    };
    fetchPendingQuestions();
  }, []);

  // Approve a question
  const approveQuestion = async (id) => {
    try {
      const response = await axios.post("http://localhost:5000/admin/questions/approve", {
        question_id: id,
      });
      setMessage(response.data.message);
      setPendingQuestions(pendingQuestions.filter((q) => q._id !== id));
    } catch (error) {
      setMessage("Error approving question.");
    }
  };

  // Reject a question
  const rejectQuestion = async (id) => {
    try {
      const response = await axios.post("http://localhost:5000/admin/questions/reject", {
        question_id: id,
      });
      setMessage(response.data.message);
      setPendingQuestions(pendingQuestions.filter((q) => q._id !== id));
    } catch (error) {
      setMessage("Error rejecting question.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      {message && <p style={styles.message}>{message}</p>}
      <h3 style={styles.subtitle}>Pending Questions</h3>
      {pendingQuestions.length > 0 ? (
        pendingQuestions.map((q) => (
          <div key={q._id} style={styles.questionCard}>
            <p style={styles.questionText}><strong>Question:</strong> {q.content}</p>
            <p style={styles.tagText}><strong>Tag:</strong> {q.tag}</p>
            <div style={styles.buttonsContainer}>
              <button onClick={() => approveQuestion(q._id)} style={styles.approveButton}>
                Approve
              </button>
              <button onClick={() => rejectQuestion(q._id)} style={styles.rejectButton}>
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={styles.noQuestions}>No pending questions.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontSize: "1.8em",
  },
  subtitle: {
    marginBottom: "15px",
    color: "#555",
    fontSize: "1.5em",
  },
  message: {
    textAlign: "center",
    color: "green",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  questionCard: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  questionText: {
    fontSize: "1.1em",
    color: "#333",
  },
  tagText: {
    fontSize: "0.9em",
    color: "#007bff",
    marginBottom: "10px",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  approveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  approveButtonHover: {
    backgroundColor: "#218838",
  },
  rejectButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  rejectButtonHover: {
    backgroundColor: "#c82333",
  },
  noQuestions: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    marginTop: "20px",
  },
};

export default AdminDashboard;