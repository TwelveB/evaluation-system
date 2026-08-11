import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
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

    if (ButtonName == "Administator") {
      navigate("/Login/Administator");
    }else if (ButtonName == "Student") {
      navigate("/Login/Student");
    }else if (ButtonName == "Assessor") {
      navigate("/Login/Assessor");
    };
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">React + Tailwind</h1>
        <p className="text-slate-400">ฝั่ง Frontend พร้อมใช้งานแล้ว!</p>
        <button 
          className="mt-5 mr-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-5 rounded"
          name="Administator"
          onClick={NavigateToPages}
          >
            Admin
        </button>
        <button 
          className="mt-5 mr-5 bg-purple-500 hover:bg-purple-700 text-white font-bold py-4 px-5 rounded"
          name="Student"
          onClick={NavigateToPages}
        >
          Student
        </button>
        <button 
          className="mt-5 mr-5 bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-5 rounded"
          name="Assessor"
          onClick={NavigateToPages}
        >
          Assessor
        </button>
      </div>
    </div>
  );
}

export default App;