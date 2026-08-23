import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyEvaluateList() {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);
  const [evaluate, setEvaluate] = useState([]);
  const [loading, setLoading] = useState(true);

  const CheckToken = () => {
    const studentToken = localStorage.getItem("studentToken");
    const info = localStorage.getItem('studentInfo');

    if (!studentToken || !info) {
      navigate("/Login/Student");
      return null;
    }

    try {
      return JSON.parse(info);
    } catch (error) {
      console.error("Invalid JSON in localStorage:", error);
      return null;
    }
  };

  const FetchEvaluate = async (studentId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/assessor/showEvaluations/${studentId}`);
      if (!res.ok) throw new Error('Failed to fetch data');

      const data = await res.json();
      setEvaluate(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const NavigateToEvaluate = (id) => {
    navigate(`/Student/MyEvaluate/${id}`);
  }

  useEffect(() => {
    const token = CheckToken();
    if (token) {
      setStudentInfo(token);
      FetchEvaluate(token.student_id);
    }
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-400 mb-6">หน้า Student</h1>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-lg animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* หัวข้อตาราง */}
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-700/80 text-sky-300 font-semibold text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 w-20 text-center">ลำดับ</th>
                  <th className="py-4 px-6">ชื่อการประเมิน</th>
                  <th className="py-4 px-6">ชื่อผู้ลงประเมินให้</th>
                  <th className="py-4 px-6">วันที่เริ่มการประเมิน</th>
                </tr>
              </thead>

              {/* เนื้อหาตาราง */}
              <tbody className="divide-y divide-slate-700/50 text-slate-300 text-sm">
                {evaluate && evaluate.length > 0 ? (
                  evaluate.map((row, idx) => (
                    <tr 
                      key={row.evaluation_id || idx} 
                      className="hover:bg-slate-700/40 transition-colors duration-200"
                      onClick={()=> NavigateToEvaluate(row.evaluation_id)}
                    >
                      <td className="py-4 px-6 text-center font-medium text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-100">
                        {row.title}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {`${row.first_name} ${row.last_name}`}
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {row.start_date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-400">
                      ไม่พบข้อมูลการประเมิน
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyEvaluateList;