import { useEffect, useState } from 'react';

import { useNavigate, Outlet } from 'react-router-dom';


function Login() {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  const CheckToken = () => {
    setLoading(true);
    const studentToken = localStorage.getItem("studentToken");
    const Info = localStorage.getItem('studentInfo');

    if (!studentToken) {
      window.location.replace('/Login/Student');
      return
    }else {
      setStudentInfo(JSON.parse(Info));
      console.log(Info);
      console.log(studentInfo);
      setLoading(false);
      console.log("มี Token");
    }
  }

  const handleLogout = () => {
      // 1. ลบ Token และข้อมูลนักเรียนทั้งหมดออกจาก localStorage
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentInfo');
      // 2. ส่งนักเรียนกลับไปหน้า Login
      window.location.replace('/Login/Student');
    };



  useEffect(() => {
    CheckToken();

    const handlePageShow = (event) => {
      if (event.persisted) {
        // event.persisted = true หมายถึงหน้านี้ถูกดึงมาจาก Cache
        CheckToken();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);



  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <Outlet/>
        <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default Login; 

