import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Administator from './pages/Admin/Administator.jsx'
import Controller from './pages/Admin/Controller.jsx'
import AddStudent from './pages/Admin/AddStudent.jsx'

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
        <Route path="/Administator" element={<Administator/>} >
          <Route index element={<Controller/>} />
          <Route path="AddStudent" element={<AddStudent/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
