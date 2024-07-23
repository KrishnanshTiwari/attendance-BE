import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Attendance System</h1>
      <div className="home-options">
        <Link to="/login" className="home-button">Login</Link>
        <Link to="/create" className="home-button">Register Player</Link>
      </div>
    </div>
  );
};

export default Home;
