import { Routes, Route } from 'react-router-dom'
import './App.css'
import FirstPage from './pages/AuthChoice'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Tickets from './pages/Tickets'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'


function App() {


  return (
    <AuthProvider>
      <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/home" element={<ProtectedRoute>
        <Home/>
      </ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute>
        <Tickets />
      </ProtectedRoute>} />
    </Routes>
    </AuthProvider>
    
    
  )
}

export default App
