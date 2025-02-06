import React, { useEffect, useState } from "react";
import axios from "axios";

const Feed = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/questions");
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Approved Questions</h2>
      {questions.length > 0 ? (
        questions.map((q) => (
          <div key={q._id} style={styles.card}>
            <p style={styles.questionText}>
              <strong>Question:</strong> {q.content}
            </p>
            <p style={styles.tagText}>
              <strong>Tag:</strong> {q.tag}
            </p>
          </div>
        ))
      ) : (
        <p style={styles.noQuestions}>No approved questions found.</p>
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
  card: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
  },
  questionText: {
    fontSize: "1.1em",
    color: "#555",
  },
  tagText: {
    fontSize: "0.9em",
    color: "#007bff",
    marginTop: "10px",
  },
  noQuestions: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    marginTop: "20px",
  },
};

export default Feed;

