import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/questions");
        console.log("Fetched questions:", response.data.questions); // Debugging
        const sortedQuestions = response.data.questions.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        console.log("Sorted questions:", sortedQuestions); // Debugging
        setQuestions(sortedQuestions);
        setFilteredQuestions(sortedQuestions);
      } catch (error) {
        console.error("Error fetching approved questions:", error);
        setMessage("Error fetching questions.");
      }
    };
    fetchQuestions();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = questions.filter(
      (question) =>
        question.content.toLowerCase().includes(query) ||
        question.tag.toLowerCase().includes(query)
    );
    setFilteredQuestions(filtered);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Approved Questions</h2>
      <input
        type="text"
        placeholder="Search questions by content or tag..."
        value={searchQuery}
        onChange={handleSearch}
        style={styles.searchBar}
      />
      {message && <p style={styles.error}>{message}</p>}
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((question) => (
          <QuestionWithComments key={question._id} question={question} />
        ))
      ) : (
        <p style={styles.noQuestions}>No questions found.</p>
      )}
    </div>
  );
};

const QuestionWithComments = ({ question }) => {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [likes, setLikes] = useState(question.likes || 0);
  const [dislikes, setDislikes] = useState(question.dislikes || 0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/comments/${question._id}`);
        const sortedComments = response.data.comments.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setComments(sortedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setMessage("Error fetching comments.");
      }
    };
    fetchComments();
  }, [question._id]);

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
        post_id: question._id,
        user_id: user.email,
        content: commentContent,
      });
      setMessage(response.data.message);
      setCommentContent("");

      // Refresh comments
      const commentsResponse = await axios.get(`http://localhost:5000/comments/${question._id}`);
      setComments(commentsResponse.data.comments);
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
      setMessage("Error adding comment.");
    }
  };

 

  return (
    <div style={styles.questionCard}>
      <p>
        <strong>Question:</strong> {question.content}
      </p>
      <p>
        <strong>Tag:</strong> {question.tag}
      </p>
      

      <h4 style={styles.commentTitle}>Comments:</h4>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} style={styles.commentCard}>
            <p>
              <strong>{comment.user_id}:</strong> {comment.content}
            </p>
            <p style={styles.commentDate}>
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p style={styles.noComments}>No comments yet.</p>
      )}

      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        style={styles.textarea}
      ></textarea>
      <button onClick={handleAddComment} style={styles.addButton}>
        Add Comment
      </button>
      {message && <p style={styles.error}>{message}</p>}
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
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  searchBar: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  questionCard: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  commentTitle: {
    marginTop: "15px",
    color: "#555",
  },
  commentCard: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f0f8ff",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    height: "60px",
    marginTop: "10px",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "vertical",
    boxSizing: "border-box",
  },
  addButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  noQuestions: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
  },
};

export default ViewQuestions;




