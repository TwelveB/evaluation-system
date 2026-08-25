import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function StudentInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const FetchStudent = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assessor/showEvaluationStudent/${id}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchStudent();
  }, [id]);

  const studentName = data.length > 0 
    ? `${data[0].student_first_name} ${data[0].student_last_name}`
    : 'นักเรียน';

  return (
    <div className="space-y-6">
      {/* NAVIGATION / HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          ← ย้อนกลับ
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-white">รายการประเมินของ: <span className="text-sky-400">{studentName}</span></h1>
        <p className="text-xs text-slate-400 mt-1">หัวข้อแบบประเมินและสถานะการประเมินย่อยทั้งหมด</p>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent mb-3"></div>
          <p className="text-sm text-slate-400">กำลังโหลดรายการประเมิน...</p>
        </div>
      ) : errorMsg ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center">
          {errorMsg}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-sm">
          ไม่พบรายการประเมินของนักเรียนคนนี้
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">#</th>
                  <th className="py-4 px-6">หัวข้อรายการประเมิน</th>
                  <th className="py-4 px-6">ผู้ประเมิน</th>
                  <th className="py-4 px-6">สถานะ</th>
                  <th className="py-4 px-6 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {data.map((row, idx) => (
                  <tr key={row.evaluation_id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-4 px-6 font-medium text-slate-100">{row.evaluation_title}</td>
                    <td className="py-4 px-6 text-slate-300">
                      {`${row.assessor_first_name || 'N/A'} ${row.assessor_last_name || ''}`}
                    </td>
                    <td className="py-4 px-6">
                      {row.status === 1 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                          เสร็จสิ้น
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
                          รอดำเนินการ
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => navigate(`/Assessor/StudentInfo/Evaluate/${row.evaluation_id}`)}
                        className="px-3.5 py-1.5 text-xs font-medium text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 rounded-lg border border-emerald-500/20 transition-all"
                      >
                        เริ่มประเมิน →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentInfo;