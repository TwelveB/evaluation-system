import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const NavigateToPages = (e) => {
    const ButtonName = e.target.name;

    navigate(ButtonName);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-sm">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">React + Tailwind</h1>
        <p className="text-slate-400">ฝั่ง Frontend พร้อมใช้งานแล้ว!</p>
        <button 
        class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        name="Administator"
        onClick={NavigateToPages}
        >
          Button
        </button>
                <button 
        class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        name="Administator"
        onClick={NavigateToPages}
        >
          Button
        </button>
      </div>
    </div>
  );
}

export default Login;