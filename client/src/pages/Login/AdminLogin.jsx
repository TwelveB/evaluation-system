import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

function Login() {
  const Session = useOutletContext(); 
  const navigate = useNavigate();
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const LoginHandle = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/login/admin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, password}),
      });
      
      // const contentType = res.headers.get('content-type');
      // if (!contentType || !contentType.includes('application/json')) {
      //   throw new Error('ไม่สามารถเชื่อมต่อ Server ได้ หรือไม่พบ API Route นี้ (404 Not Found)');
      // }

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        // setIsSubmitting(false);
        return;
      }
      
      // บันทึก Token และ ข้อมูลนักเรียนลงใน localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data.admin));

      console.log("Login สำเร็จ");
      navigate('/Administator/Dashboard'); 
    }
    catch (err) {
      console.error('Error fetching admin:', err);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setusername(value);
    if (name === 'password') setPassword(value);
  };

  const NavigateToPages = (e) => {
    const ButtonName = e.target.name;

    navigate(ButtonName);
  };

  return (
      // <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-sm">
       <div className="">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">{Session.Admin} Login</h1>
          <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="อีเมล"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                required 
          />
          <input
                type="text"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="รหัสผ่าน"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                required 
          />
        <button 
        class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        name="Login"
        onClick={LoginHandle}
        >
          Login
        </button>
      </div>
  );
}

export default Login;