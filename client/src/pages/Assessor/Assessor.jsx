import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';


function Assessor() {
  const navigate = useNavigate();
  const [assessorInfo, setAssessorInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  const CheckToken = () => {
    setLoading(true);
    const assessorToken = localStorage.getItem("assessorToken");
    const Info = localStorage.getItem('assessorInfo');

    if (!assessorToken) {
      window.location.replace("/Login/Assessor");
      return
    }else {
      setAssessorInfo(JSON.parse(Info));
      console.log(Info);
      console.log(assessorInfo);
      setLoading(false);
      console.log("มี Token");
    }
  }

  useEffect(() => {
    CheckToken();
  }, []);



  return (
      <div className="">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">หน้า Student</h1>
        {loading ? (
          <p className="text-slate-400">กำลังโหลดข้อความ...</p>
        ) :
        (<p className="text-slate-400">สวัสดีครับคุณ {assessorInfo.first_name} {assessorInfo.last_name}</p>)
        }
      </div>
  );
}

export default Assessor; 

