import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebcamDetection from './Components/WebcamDetection';
import Login from './Components/Login';
import AttendanceList from './Components/AttendanceList';
import User from './Components/User';
import Home from './Components/Home';
import Create from './Components/Create';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/webcam" element={<WebcamDetection />} />
        <Route path="/create" element={<Create/>} />
        <Route path="/user" element={<User/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
