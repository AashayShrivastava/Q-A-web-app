import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State for tracking menu
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.is_admin || false;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    setMenuOpen(false); // Close the menu
    navigate("/login"); // Redirect to Login page
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false); // Close the menu when a link is clicked
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Q&A App</div>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`menu ${menuOpen ? "open" : ""}`}>
        <Link to="/signup" className="menu-item" onClick={closeMenu}>
          Signup
        </Link>
        <Link to="/login" className="menu-item" onClick={closeMenu}>
          Login
        </Link>
        <Link to="/post-question" className="menu-item" onClick={closeMenu}>
          Post Question
        </Link>
        <Link to="/feed" className="menu-item" onClick={closeMenu}>
          Feed
        </Link>
        <Link to="/questions" className="menu-item" onClick={closeMenu}>
          View Questions
        </Link>

        {user && (
          <Link to="/my-questions" className="menu-item" onClick={closeMenu}>
            My Pending Posts
          </Link>
        )}
        
        {isAdmin && (
          <Link to="/admin" className="menu-item" onClick={closeMenu}>
            Admin Dashboard
          </Link>
        )}
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


























