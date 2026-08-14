import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

function Login() {
  const LoginSession = { Admin: "Admin", Student: "Student", Assessor: "Assessor" };;
  const navigate = useNavigate();

  const ReturnLogin = () => {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-sm">
         <main className="flex-1 p-8">
            <Outlet context={LoginSession}/>
          </main>
        <button 
        class="mt-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        name="Administator"
        onClick={ReturnLogin}
        >
          กลับ
        </button>
      </div>
    </div>
  );
}

export default Login;