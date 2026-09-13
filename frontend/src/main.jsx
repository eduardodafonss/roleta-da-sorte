import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<Dashboard/>} />
          <Route path="register" element={<Register/>} />
          <Route path="login" element={<Login/>} />
          <Route path="admin" element={<AdminPanel/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
