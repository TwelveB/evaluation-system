import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import "./App.css";


function App() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Token, setToken] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/students`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setErrorMsg('Could not load student data.');
    } finally {
      setLoading(false);
    }
  };

  const CheckToken = () => {
    const studentToken = localStorage.getItem("studentToken");
    const adminToken = localStorage.getItem("adminToken");
    const assessorToken = localStorage.getItem("assessorToken");
    
    if (studentToken || adminToken || assessorToken) {
      setToken(true);
    }else {
      setToken(false);
    }
  }

  const Logout = () => {
    localStorage.clear();
    window.location.reload();
  }

  const handleRoleNavigate = (role) => {
    navigate(`/Login/${role}`);
  };

  useEffect(() => {
    fetchStudents();
    CheckToken();
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
            Dashboard
          </span>
        </div>

        {/* Quick Login / Role Switcher */}
        <div className="flex items-center gap-3">
          {!Token ? (
          <>
          <span className="text-sm text-slate-400 hidden sm:inline">Sign in as:</span>
          <button
            onClick={() => handleRoleNavigate('Student')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-purple-600 hover:text-white transition-all"
          >
            Student
          </button>
          <button
            onClick={() => handleRoleNavigate('Assessor')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition-all"
          >
            Assessor
          </button>
          <button
            onClick={() => handleRoleNavigate('Admin')}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <span>👨‍💼</span> Login Admin
          </button>
     
        </>
          ) : (
            <>
              <button
                onClick={() => Logout()}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5"
              >
                <span>👨‍💼</span> Log out
              </button>
            </>
          )
        }
        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <>
         <Dashboard Login={Token}/>
      </>

        {/* Data Table Section (Student List API) */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">รายชื่อนักเรียน</h2>
              <p className="text-xs text-slate-400">โหลดข้อมูลจากเซิร์ฟเวอร์</p>
            </div>
            <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-lg">
              Total: {students.length}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
              <p className="text-sm">Loading student records...</p>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-8 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm">
              {errorMsg}
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No student records found.
            </div>
          ) : (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl mx-auto max-w-7xl w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">role</th>
                    <th className="py-3 px-4">Status</th>
                    {/* <th className="py-3 px-4 text-right">Action</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm text-slate-300">
                  {students.map((student, idx) => (
                    <tr key={student.student_id || idx} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-white">{student.first_name || 'N/A'}</td>
                      <td className="py-3 px-4 font-medium text-white">{student.role || 'Student'}</td>
                      <td className="py-3 px-4">
                        {student.status === 1 ? (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        ระบบประเมินผลนักเรียน 
      </footer>

    </div>
  );
}

export default App;