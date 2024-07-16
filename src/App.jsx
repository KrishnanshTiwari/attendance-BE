import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WebcamDetection from './Components/WebcamDetection'
import Login from './Components/Login'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/webcam' element={<WebcamDetection/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
