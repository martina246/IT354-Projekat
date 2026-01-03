import { Routes, Route } from 'react-router-dom'
import './App.css'
import FirstPage from './pages/AuthChoice'
import Login from './pages/login'
import Registration from './pages/registration'
import Home from './pages/Home'

function App() {


  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/home" element={<Home />} />
    </Routes>
    
  )
}

export default App
