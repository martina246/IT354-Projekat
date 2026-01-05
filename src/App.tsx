import { Routes, Route } from 'react-router-dom'
import './App.css'
import FirstPage from './pages/AuthChoice'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Tickets from './pages/Tickets'

function App() {


  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tickets" element={<Tickets />} />
    </Routes>
    
  )
}

export default App
