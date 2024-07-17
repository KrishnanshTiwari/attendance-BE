import { BrowserRouter, Route, Routes } from "react-router-dom";
import WebcamDetection from "./Components/WebcamDetection";
import Login from "./Components/Login";
import AttendanceList from "./Components/AttendanceList";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/webcam" element={<WebcamDetection />} />
        <Route path="/attendances" element={<AttendanceList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
