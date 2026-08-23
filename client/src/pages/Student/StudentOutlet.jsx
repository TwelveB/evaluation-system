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

  const handleNavigate = (path) => {
    navigate(`/Student/${path}`);
  }

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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
              {/* 1. TOP NAVBAR */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-purple-400 bg-clip-text text-transparent">
            EvaluateHub
          </span>
          <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full font-medium">
            Student Dashboard
          </span>
        </div>

        {/* Quick Login / Role Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:inline">Menu:</span>
          <button
            onClick={() => handleNavigate('/MyEvaluateList')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition-all"
          >
            ดูรอบการประเมินของตัวเอง
          </button>
          <button
            onClick={() => handleNavigate('/')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600 hover:text-white transition-all"
          >
            หน้าหลัก
          </button>
        </div>
      </header>
           {/* // end top navbar */}
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-xl">
          <Outlet/>
          <button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" >Log out</button>
        </div>
      </div>
    </div>
  );
}

export default Login; 

