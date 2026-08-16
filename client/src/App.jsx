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

  const checkToken = () => {
    const studentToken = localStorage.getItem("studentToken");
    if (studentToken) {
      navigate("/Student");
    }else {
      return
    }
  }

  const NavigateToPages = (path) => {
    navigate(path);
  };

    //   if (ButtonName == "Administator") {
    //   navigate("/Login/Administator");
    // }else if (ButtonName == "Student") {
    //   navigate("/Login/Student");
    // }else if (ButtonName == "Assessor") {
    //   navigate("/Login/Assessor");
    // };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      
      <div className="relative z-10 w-full max-w-3xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-purple-400 bg-clip-text text-transparent">
              EvaluateHub
            </div>
          </div>
          <p className="text-xl text-slate-300 mb-2">Student Evaluation System</p>
          <p className="text-slate-400">Select your role to access the platform</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          
          {/* Role Selection Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            
            {/* Admin Card */}
            <div className="group cursor-pointer">
              <button 
                className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-8 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border border-blue-500/30 hover:border-blue-400/60"
                name="Administator"
                onClick={() => NavigateToPages('/Login/Admin')}
              >
                <div className="text-4xl mb-3">👨‍💼</div>
                <div className="text-lg font-bold">Administrator</div>
                <p className="text-sm text-blue-100 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Manage students & evaluations</p>
              </button>
            </div>

            {/* Student Card */}
            <div className="group cursor-pointer">
              <button 
                className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-semibold py-8 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border border-purple-500/30 hover:border-purple-400/60"
                name="Student"
                onClick={() => NavigateToPages('/Login/Student')}
              >
                <div className="text-4xl mb-3">👨‍🎓</div>
                <div className="text-lg font-bold">Student</div>
                <p className="text-sm text-purple-100 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">View your evaluations</p>
              </button>
            </div>

            {/* Assessor Card */}
            <div className="group cursor-pointer">
              <button 
                className="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-semibold py-8 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border border-emerald-500/30 hover:border-emerald-400/60"
                name="Assessor"
                onClick={() => NavigateToPages('/Login/Assessor')}
              >
                <div className="text-4xl mb-3">👨‍🏫</div>
                <div className="text-lg font-bold">Assessor</div>
                <p className="text-sm text-emerald-100 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Evaluate students</p>
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="border-t border-slate-700/50 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Secure evaluation platform for educational institutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;