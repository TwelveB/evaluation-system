import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Dashboard({ Login, username }) {
    const navigate = useNavigate();

    const handleRoleNavigate = (role) => {
      navigate(`/Login/${role}`);
    };
  return (
    <>
      {/* 2. MAIN DASHBOARD CONTENT */}
      {!Login ? (
      <>
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold text-white">Overview Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Student Evaluation & Performance Metrics System</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="self-start md:self-auto bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white px-5 py-2.5 rounded-xl border border-slate-600 text-sm font-semibold transition-all flex items-center gap-2"
          >
            🚪 Go to Login Page
          </button>
        </div>

        {/* Quick Access Roles Grid */}
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Select Access Portal</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Admin Portal Card */}
            <div 
              onClick={() => handleRoleNavigate('Admin')}
              className="group cursor-pointer bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex items-center gap-4"
            >
              <div className="p-4 bg-blue-500/10 rounded-xl text-3xl group-hover:scale-110 transition-transform">
                👨‍💼
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">Administrator</h3>
                <p className="text-xs text-slate-400 mt-1">Manage system & students</p>
              </div>
            </div>

            {/* Student Portal Card */}
            <div 
              onClick={() => handleRoleNavigate('Student')}
              className="group cursor-pointer bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/10 flex items-center gap-4"
            >
              <div className="p-4 bg-purple-500/10 rounded-xl text-3xl group-hover:scale-110 transition-transform">
                👨‍🎓
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">Student Portal</h3>
                <p className="text-xs text-slate-400 mt-1">View personal evaluations</p>
              </div>
            </div>

            {/* Assessor Portal Card */}
            <div 
              onClick={() => handleRoleNavigate('Assessor')}
              className="group cursor-pointer bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 flex items-center gap-4"
            >
              <div className="p-4 bg-emerald-500/10 rounded-xl text-3xl group-hover:scale-110 transition-transform">
                👨‍🏫
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">Assessor Portal</h3>
                <p className="text-xs text-slate-400 mt-1">Evaluate student results</p>
              </div>
            </div>

          </div>
        </div>
        </div> 
      </>
      ) : ( //ถ้ามี Token ให้แสดงตรงนี้
        <>
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          <h1 className='text-5xl'>สวัสดีท่านผู้ใช้งานครับ</h1>
          <h3 className='text-3xl'>ยินดีต้อนรับเข้าสู่เว็บไซต์การประเมิน ท่านได้ Loginแล้วหากต้องการเข้าสู้ระบบให้ทำการกดปุ่มด้านล่าง</h3>
                    <div className="grid md:grid-cols-3 gap-6">
            
            {/* Admin Portal Card */}
            <div 
              onClick={() => handleRoleNavigate('Admin')}
              className="group cursor-pointer bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex items-center gap-4"
            >
              <div className="p-4 bg-blue-500/10 rounded-xl text-3xl group-hover:scale-110 transition-transform">
                👨‍💼
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">Administrator</h3>
                <p className="text-xs text-slate-400 mt-1">Manage system & students</p>
              </div>
            </div>

            {/* Student Portal Card */}
            <div 
              onClick={() => handleRoleNavigate('Student')}
              className="group cursor-pointer bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/10 flex items-center gap-4"
            >
              <div className="p-4 bg-purple-500/10 rounded-xl text-3xl group-hover:scale-110 transition-transform">
                👨‍🎓
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">Student Portal</h3>
                <p className="text-xs text-slate-400 mt-1">View personal evaluations</p>
              </div>
            </div>

            {/* Assessor Portal Card */}
            <div 
              onClick={() => handleRoleNavigate('Assessor')}
              className="group cursor-pointer bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 flex items-center gap-4"
            >
              <div className="p-4 bg-emerald-500/10 rounded-xl text-3xl group-hover:scale-110 transition-transform">
                👨‍🏫
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">Assessor Portal</h3>
                <p className="text-xs text-slate-400 mt-1">Evaluate student results</p>
              </div>
            </div>

          </div>
        </div> 
        </>
      )
    }
  </>
     );
}

export default Dashboard;