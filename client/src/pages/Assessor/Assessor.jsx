import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';


function Login() {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  // const CheckToken = () => {
  //   setLoading(true);
  //   const studentToken = localStorage.getItem("studentToken");
  //   const Info = localStorage.getItem('studentInfo');

  //   if (!studentToken) {
  //     navigate(-1, {replace: true});
  //     return
  //   }else {
  //     setStudentInfo(JSON.parse(Info));
  //     console.log(Info);
  //     console.log(studentInfo);
  //     setLoading(false);
  //     console.log("มี Token");
  //   }
  // }

  // useEffect(() => {
  //   CheckToken();
  // }, []);



  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-sm">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">หน้า Student</h1>
        {loading ? (
          <p className="text-slate-400">กำลังโหลดข้อความ...</p>
        ) :
        (<p className="text-slate-400">สวัสดีครับคุณ {studentInfo.first_name} {studentInfo.last_name}</p>)
        }
      </div>
    </div>
  );
}

export default Login; 

