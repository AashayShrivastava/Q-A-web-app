import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentsSection from "./CommentsSection";

const QuestionsList = () => {
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
      <h2 style="text-align: center; color: rgb(51, 51, 51); margin-bottom: 20px; margin-top:200px">Approved Questions</h2>
      {questions.length > 0 ? (
        questions.map((q) => (
          <div key={q._id} style={styles.questionCard}>
            <p style={styles.questionText}>
              <strong>Question:</strong> {q.content}
            </p>
            <p style={styles.tagText}>
              <strong>Tag:</strong> {q.tag}
            </p>
            <CommentsSection postId={q._id} />
          </div>
        ))
      ) : (
        <p style={styles.noQuestions}>No approved questions available.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "120px auto", // Ensure content is below the navbar
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
    fontSize: "1.8rem",
    marginTop: "200px",
  },
  questionCard: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
  },
  questionText: {
    fontSize: "1.1rem",
    color: "#555",
    wordWrap: "break-word",
  },
  tagText: {
    fontSize: "0.9rem",
    color: "#007bff",
    marginBottom: "10px",
  },
  noQuestions: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    marginTop: "20px",
  },
  // Ensure textarea resizes only vertically
  textArea: {
    width: "100%",
    fontSize: "1rem",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "vertical",
    boxSizing: "border-box",
  },
  // Responsive Styling
  "@media (max-width: 768px)": {
    container: {
      margin: "140px 15px", // Adjust for mobile
      padding: "15px",
    },
    title: {
      fontSize: "1.5rem",
    },
    questionCard: {
      padding: "12px",
      marginBottom: "15px",
    },
    questionText: {
      fontSize: "1rem",
    },
    tagText: {
      fontSize: "0.8rem",
    },
  },
};

export default QuestionsList;







