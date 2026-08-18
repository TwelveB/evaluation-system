import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

function AssessorLayout() {
  const navigate = useNavigate();
  const [assessorInfo, setAssessorInfo] = useState(null);

  const CheckToken = () => {
    const assessorToken = localStorage.getItem("assessorToken");
    const Info = localStorage.getItem('assessorInfo');

    if (!assessorToken) {
      window.location.replace("/Login/Assessor");
    } else {
      setAssessorInfo(JSON.parse(Info));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('assessorToken');
    localStorage.removeItem('assessorInfo');
    window.location.replace('/Login/Assessor');
  };

  useEffect(() => {
    CheckToken();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col">
      {/* TOP NAVBAR */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
            E
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
            EvaluateHub
          </span>
        </div>

        {assessorInfo && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-full py-1 px-3">
              <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-semibold text-xs">
                {assessorInfo.first_name?.[0] || 'U'}
              </div>
              <span className="text-xs text-slate-300 font-medium">
                {assessorInfo.first_name} {assessorInfo.last_name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs px-3.5 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-medium"
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AssessorLayout;