import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';


function StudentList() {
  const navigate = useNavigate();
  const [assessorInfo, setAssessorInfo] = useState(null);
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg , seterrorMsg] = useState('');

  const FetchStudent = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students',
        {
          method: 'GET'
        }
      );
      const data = await res.json();
      setData(data);
    }
    catch (err){
      console.log("พบปัญหา:", err);
    }
    finally {
      setLoading(false);
    }
  }

  const NavigateInfo = (id) => {
    navigate(`/Assessor/StudentInfo/${id}`);
  }

  useEffect(() => {
    FetchStudent();
  }, []);

  return (
      <div className="">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">รายชื่อนักเรียน</h1>
                  {loading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
              <p className="text-sm">Loading student records...</p>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-8 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm">
              {errorMsg}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No student records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">ชื่อนักเรียน</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm text-slate-300">
                  {data.map((dataRow, idx) => (
                    <tr key={dataRow.student_id || idx} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-white">{`${dataRow.first_name || 'N/A'} ${dataRow.last_name || 'N/A'}`}</td>
                      <td className="py-3 px-4">
                        {dataRow.status === 1 ? (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                            ประเมินเสร็จสิ้น
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300">
                            กำลังรอการประเมิน
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => NavigateInfo(dataRow.student_id)}
                          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                        >
                          ไปดูรายการ →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
  );
}

export default StudentList; 

