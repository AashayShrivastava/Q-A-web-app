import React from "react";

const Home = () => {
  const styles = {
    container: {
      textAlign: "center",
      padding: "50px 20px",
      fontFamily: "'Roboto', sans-serif",
      backgroundColor: "#f4f4f4",
      minHeight: "calc(100vh - 70px)", // Adjust for navbar height
    },
    title: {
      fontSize: "2.5em",
      color: "#333",
    },
    subtitle: {
      fontSize: "1.2em",
      color: "#555",
      marginTop: "10px",
    },
    button: {
      marginTop: "20px",
      padding: "10px 20px",
      fontSize: "1em",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      textDecoration: "none",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Q&A App</h1>
      <p style={styles.subtitle}>
        A platform to ask, answer, and explore knowledge.
      </p>
      <a href="/feed" style={styles.button}>
        Explore Questions
      </a>
    </div>
  );
};

export default Home;
