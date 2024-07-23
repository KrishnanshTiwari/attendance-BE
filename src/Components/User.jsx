import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../Constant/services'; // Adjust the path as needed
import './User.css'; // Import the CSS file for styling

const User = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  useEffect(() => {
    // Fetch user details when the component mounts
    const fetchUserDetails = async () => {
      const eid = localStorage.getItem('eid'); // Get eid from local storage

      if (!eid) {
        navigate('/login'); // Redirect to login if eid is not found
        return;
      }

      try {
        const userDetails = await getUserDetails(eid);
        setUser(userDetails);

        // Check if attendance is marked
        const token = localStorage.getItem(eid);
        if (token) {
          const { time, latitude, longitude } = JSON.parse(token);
          setAttendanceStatus(`Attendance marked at ${time} (Lat: ${latitude}, Lon: ${longitude})`);
        }
      } catch (error) {
        setError("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleMarkAttendance = () => {
    navigate('/webcam'); // Navigate to the webcam page
  };

  const handleLogout = () => {
    localStorage.removeItem('eid'); // Clear the `eid` token
    navigate('/'); // Redirect to login page
  };

  if (loading) {
    return <div className="user-container">Loading...</div>;
  }

  if (error) {
    return <div className="user-container">{error}</div>;
  }

  if (!user) {
    return <div className="user-container">No user details available</div>;
  }

  return (
    <div className="user-container">
      <h2>User Details</h2>
      <div className="user-info">
        <div className="info-item"><strong>ID:</strong> {user.eid}</div>
        <div className="info-item"><strong>First Name:</strong> {user.first_name}</div>
        <div className="info-item"><strong>Last Name:</strong> {user.last_name}</div>
        <div className="info-item"><strong>Mother Name:</strong> {user.mother_name}</div>
        <div className="info-item"><strong>Father Name:</strong> {user.father_name}</div>
        <div className="info-item"><strong>Address:</strong> {user.address}</div>
        <div className="info-item"><strong>Phone:</strong> {user.mobile_number}</div>
        <div className="info-item"><strong>DOB:</strong> {user.dob}</div>
        <div className="info-item"><strong>Sports:</strong> {user.sports_name}</div>
      </div>
      <div className="actions">
        {attendanceStatus ? (
          <p className="attendance-status">{attendanceStatus}</p>
        ) : (
          <button onClick={handleMarkAttendance} className="mark-attendance-btn">Mark Attendance</button>
        )}
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};



export default User;
