import { Routes, Route } from 'react-router-dom'
import './App.css'
import FirstPage from './pages/AuthChoice'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Tickets from './pages/Tickets'
import AdminDashboard from './pages/AdminDashboard'
import AdminTickets from './pages/AdminTickets'
import AdminTicketDetails from './pages/AdminTicketDetails'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import AdminCategories from './pages/AdminCategories'
import AdminUsers from './pages/AdminUsers'


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
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/tickets" element={
          <AdminRoute>
            <AdminTickets />
          </AdminRoute>
          }/>
        <Route path="/admin/tickets/:id" element={
          <AdminRoute>
            <AdminTicketDetails />
          </AdminRoute>
        } />
        <Route path="/admin/categories" element={
          <AdminRoute>
            <AdminCategories />
          </AdminRoute>
        }/>
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }/>

        

    </Routes>
    </AuthProvider>
    
    
  )
}

export default App
