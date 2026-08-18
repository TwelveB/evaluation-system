import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import Administrator from './pages/Admin/Administrator.jsx'
import Controller from './pages/Admin/Controller.jsx'
import AddStudent from './pages/Admin/AddStudent.jsx'
import AddAssessor from './pages/Admin/AddAssessor.jsx'

import LoginOutlet from './pages/Login/LoginOutlet.jsx'
import StudentLogin from './pages/Login/StudentLogin.jsx'
import AdminLogin from './pages/Login/AdminLogin.jsx'
import AssessorLogin from './pages/Login/AssessorLogin.jsx'
import LoginDashboard from './pages/Login/Dashboard.jsx'

import StudentOutlet from './pages/Student/StudentOutlet.jsx'
import Student from './pages/Student/Student.jsx'

import AssessorOutlet from './pages/Assessor/AssessorOutlet.jsx'
import Assessor from './pages/Assessor/Assessor.jsx'
import StudentList from './pages/Assessor/StudentList.jsx'
import StudentInfo from './pages/Assessor/StudentInfo.jsx'
import EvaluatePage from './pages/Assessor/Evaluate.jsx'

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

        <Route path="/Student" element={<StudentOutlet/>} >
          <Route index element={<Student/>} />
        </Route>

        <Route path="/Assessor" element={<AssessorOutlet/>} >
          <Route index element={<Assessor/>} />
          <Route path="StudentList" element={<StudentList/>} />
          <Route path="StudentInfo/:id" element={<StudentInfo/>} />
          <Route path="StudentInfo/Evaluate/:id" element={<EvaluatePage/>} />
        </Route>

        <Route path="/Administrator" element={<Administrator/>} >
          <Route index element={<Controller/>} />
          <Route path="Dashboard" element={<Controller/>} />
          <Route path="AddAssessor" element={<AddAssessor/>} />
          <Route path="AddStudent" element={<AddStudent/>} />
        </Route>
        {/* <Route path="/Student" element={<Administator/>} > */}

        <Route path="/Login" element={<LoginDashboard/>} />
          
        {/* Route outlet */}
        <Route path="/Login" element={<LoginOutlet/>} >
          <Route path="Student" element={<StudentLogin/>} />
          <Route path="Admin" element={<AdminLogin/>} />
          <Route path="Assessor" element={<AssessorLogin/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
