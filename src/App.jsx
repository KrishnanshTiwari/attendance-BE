import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebcamDetection from './Components/WebcamDetection';
import Login from './Components/Login';
import AttendanceList from './Components/AttendanceList';
import User from './Components/User';
import Home from './Components/Home';
import Create from './Components/Create';
import { ProtectedRoute, PublicRoute } from './Components/ProtectedRoute';
import './App.css';
//testing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute element={Home} />} />
        <Route path="/login" element={<PublicRoute element={Login} />} />
        <Route path="/webcam" element={<PublicRoute element={WebcamDetection} />} />
        <Route path="/create" element={<PublicRoute element={Create} />} />
        <Route path="/user" element={<ProtectedRoute element={User} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
