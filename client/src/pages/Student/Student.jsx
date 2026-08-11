import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const CheckToken = () => {
    const studentToken = localStorage.getItem("studentToken");
    if (!studentToken) {
      navigate(-1);
      return
    }else {
      console.log("มี Token")
    }
  }

  const handleLogout = () => {
      // 1. ลบ Token และข้อมูลนักเรียนทั้งหมดออกจาก localStorage
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentInfo');

      // 2. ส่งนักเรียนกลับไปหน้า Login
      navigate('/Login/Student');
    };

  useEffect(() => {
    CheckToken();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-sm">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">หน้า Student</h1>
        <p className="text-slate-400">ฝั่ง Frontend พร้อมใช้งานแล้ว!</p>
        <button 
        class="mt-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        name="Administator"
        onClick={handleLogout}
        >
          Log out
        </button>

      </div>
    </div>
  );
}

export default Login;