import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';

function Administator() {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);

  const [loading, setLoading] = useState(true);

    const CheckToken = () => {
    setLoading(true);
    const adminToken = localStorage.getItem("adminToken");
    const Info = localStorage.getItem('adminInfo');

    if (!adminToken) {
      window.location.replace('/Login/Admin');
      return
    }else {
      setAdminInfo(JSON.parse(Info));
      console.log(Info);
      console.log(adminInfo);
      setLoading(false);
      console.log("มี Token");
    }
  }

  const handleLogout = () => {
      // 1. ลบ Token และข้อมูลนักเรียนทั้งหมดออกจาก localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      // 2. ส่งนักเรียนกลับไปหน้า Login
      window.location.replace('/Login/Admin');
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
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-xl">
          <main className="flex-1 p-8">
            <Outlet />
            <button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </main>
      </div>
    </div>
  );
}

export default Administator;