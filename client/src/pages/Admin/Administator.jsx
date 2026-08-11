import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';

function Administator() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-sm">
          <main className="flex-1 p-8">
            <Outlet />
          </main>
      </div>
    </div>
  );
}

export default Administator;