import { Routes, Route } from 'react-router'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
