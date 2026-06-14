import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Auth/login'
import HelloPage from './pages/Home/hello'
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/hello" element={<ProtectedRoute><HelloPage /></ProtectedRoute>} />
    </Routes>
  )
}
