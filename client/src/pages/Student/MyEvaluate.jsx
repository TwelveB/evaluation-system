import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function MyEvaluateList() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [studentInfo, setStudentInfo] = useState(null);
  const [criteriaList, setCriteriaList] = useState([]);
  const [documentPath, setDocumentPath] = useState(null);
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

  const FetchEvaluate = async (evaluationId) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assessor/evaluation-criteria/${evaluationId}`);
      if (!res.ok) throw new Error('Failed to fetch data');

      const data = await res.json();
      
      // ปรับการเก็บ State ให้รองรับโครงสร้าง API ใหม่
      setCriteriaList(data.criteria || []);
      setDocumentPath(data.document_path || null);
    } catch (err) {
      console.error("Error fetching criteria:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = CheckToken();
    if (token) {
      setStudentInfo(token);
      FetchEvaluate(id);
    }
  }, [id]);

  // คำนวณคะแนนรวมทั้งหมด
  const totalScore = criteriaList.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const maxTotalScore = criteriaList.reduce((acc, curr) => acc + (Number(curr.max_score) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
       
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              เกณฑ์การประเมินและการลงคะแนน
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              รหัสการประเมิน: <span className="text-sky-400 font-mono">#{id}</span>
              {studentInfo && ` | ผู้ใช้งาน: ${studentInfo.first_name || ''} ${studentInfo.last_name || ''}`}
            </p>
          </div>

          {/* ปุ่มเปิดดูไฟล์หลักฐาน */}
          {documentPath && (
            <a
              href={`http://localhost:5000${documentPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition font-medium text-sm w-fit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              เปิดดูไฟล์แนบเอกสาร (PDF)
            </a>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20 bg-slate-800/30 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span>กำลังโหลดข้อมูลการประเมิน...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Score Summary Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
                <span className="text-slate-400 text-xs uppercase font-semibold tracking-wider">คะแนนรวมที่ได้</span>
                <div className="text-3xl font-extrabold text-sky-400 mt-2">
                  {totalScore} <span className="text-base font-normal text-slate-400">/ {maxTotalScore} คะแนน</span>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
                <span className="text-slate-400 text-xs uppercase font-semibold tracking-wider">จำนวนข้อที่ประเมิน</span>
                <div className="text-3xl font-extrabold text-slate-200 mt-2">
                  {criteriaList.filter(item => item.score !== null).length} <span className="text-base font-normal text-slate-400">/ {criteriaList.length} รายการ</span>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
                <span className="text-slate-400 text-xs uppercase font-semibold tracking-wider">เอกสารประกอบ</span>
                <div className="text-sm font-medium mt-3">
                  {documentPath ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> มีไฟล์หลักฐานแนบไว้
                    </span>
                  ) : (
                    <span className="text-slate-500">ไม่มีไฟล์แนบ</span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Data Table */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-700/80 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 w-16 text-center">#</th>
                      <th className="py-4 px-6 min-w-[240px]">หัวข้อการประเมิน / รายละเอียด</th>
                      <th className="py-4 px-6 w-28 text-center">น้ำหนัก</th>
                      <th className="py-4 px-6 w-36 text-center">คะแนนที่ได้</th>
                      <th className="py-4 px-6 min-w-[200px]">ความคิดเห็นเพิ่มเติม</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700/40 text-slate-300 text-sm">
                    {criteriaList.length > 0 ? (
                      criteriaList.map((item, idx) => (
                        <tr key={item.criterion_id || idx} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-5 px-6 text-center font-medium text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="py-5 px-6 space-y-1">
                            <div className="font-semibold text-slate-100 text-base">{item.title}</div>
                            {item.description && (
                              <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                            )}
                            {item.requires_evidence === 1 && (
                              <span className="inline-block text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full mt-1">
                                ต้องการหลักฐานประกอบ
                              </span>
                            )}
                          </td>
                          <td className="py-5 px-6 text-center font-medium text-slate-400">
                            {item.weight}%
                          </td>
                          <td className="py-5 px-6 text-center">
                            {item.score !== null ? (
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-sky-500/10 text-sky-400 font-bold border border-sky-500/20">
                                {item.score} <span className="text-slate-500 text-xs ml-1 font-normal">/ {item.max_score}</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 text-xs italic">ยังไม่ให้คะแนน</span>
                            )}
                          </td>
                          <td className="py-5 px-6 text-slate-400">
                            {item.comment ? (
                              <span className="italic">"{item.comment}"</span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-slate-400">
                          ไม่พบข้อมูลเกณฑ์การประเมิน
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
  );
}

export default MyEvaluateList;