import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');

  const FetchStudent = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      const result = await res.json();
      setData(result);
    } catch (err) {
      setErrorMsg('ไม่สามารถเชื่อมต่อข้อมูลได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchStudent();
  }, []);

  const filteredData = data.filter((item) =>
    `${item.first_name} ${item.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const completedCount = data.filter((d) => d.status === 1).length;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">รายชื่อนักเรียน</h1>
          <p className="text-sm text-slate-400">จัดการและตรวจสอบสถานะการประเมินนักเรียนทั้งหมด</p>
        </div>
        <input
          type="text"
          placeholder="ค้นหาชื่อนักเรียน..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-64 transition-all"
        />
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">นักเรียนทั้งหมด</p>
            <p className="text-2xl font-bold text-white mt-1">{data.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
            👥
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">ประเมินเสร็จแล้ว</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>
      </div>

      {/* DATA TABLE / CONTENT */}
      {loading ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent mb-3"></div>
          <p className="text-sm text-slate-400">กำลังโหลดข้อมูลนักเรียน...</p>
        </div>
      ) : errorMsg ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center">
          {errorMsg}
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-sm">
          ไม่พบข้อมูลนักเรียน
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">#</th>
                  <th className="py-4 px-6">ชื่อ-นามสกุล นักเรียน</th>
                  <th className="py-4 px-6">สถานะการประเมิน</th>
                  <th className="py-4 px-6 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {filteredData.map((dataRow, idx) => (
                  <tr key={dataRow.student_id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-4 px-6 font-medium text-slate-100">
                      {`${dataRow.first_name || 'N/A'} ${dataRow.last_name || 'N/A'}`}
                    </td>
                    <td className="py-4 px-6">
                      {dataRow.status === 1 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          ประเมินเสร็จสิ้น
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                          กำลังรอการประเมิน
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => navigate(`/Assessor/StudentInfo/${dataRow.student_id}`)}
                        className="px-3.5 py-1.5 text-xs font-medium text-sky-400 hover:text-white bg-sky-500/10 hover:bg-sky-500 rounded-lg border border-sky-500/20 transition-all"
                      >
                        ดูรายการประเมิน →
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

export default StudentList;