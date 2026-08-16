import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import Administator from './pages/Admin/Administator.jsx'
import Controller from './pages/Admin/Controller.jsx'
import AddStudent from './pages/Admin/AddStudent.jsx'

import LoginOutlet from './pages/Login/LoginOutlet.jsx'
import StudentLogin from './pages/Login/StudentLogin.jsx'
import AdminLogin from './pages/Login/AdminLogin.jsx'
import AssessorLogin from './pages/Login/AssessorLogin.jsx'

import Student from './pages/Student/Student.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
      {/* Navigation */}
      {/* <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/about">About</Link> |{" "}
        <Link to="/contact">Contact</Link>
      </nav> */}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<App/>} />

        <Route path="/Student" element={<Student/>} />

        <Route path="/Administator" element={<Administator/>} >
          <Route index element={<Controller/>} />
          <Route path="Dashboard" element={<Controller/>} />
          <Route path="AddStudent" element={<AddStudent/>} />
        </Route>
        {/* <Route path="/Student" element={<Administator/>} > */}
          
        {/* </Route> outlet */}
        <Route path="/Login" element={<LoginOutlet/>} >
          <Route path="Student" element={<StudentLogin/>} />
          <Route path="Admin" element={<AdminLogin/>} />
          <Route path="Assessor" element={<AssessorLogin/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
