import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Administator() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStudents = async () => {
    try { 
      const res = await fetch('http://localhost:5000/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const GoToAddStudent = () => {
    navigate('/Administator/AddStudent');
  };
  const handleLogout = () => {
      // 1. ลบ Token และข้อมูลนักเรียนทั้งหมดออกจาก localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      // 2. ส่งนักเรียนกลับไปหน้า Login
      navigate('/Login/Admin');
    };

  useEffect(() => { //ทำงานเมื่อเริ่มหน้าเว็บ
    fetchStudents();
  }, []);

  return (
      <div className="">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">Welcome Admin</h1>
        <h2 className="text-slate-400">พร้อมบันทึกข้อมูลของนักเรียน</h2>
        <button class="mt-5 mr-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={GoToAddStudent}>
          Add Student
        </button>
        <button class="mt-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={GoBack}>
          Back
        </button>
        {/* ตารางแสดงผลรายชื่อนักเรียน */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            รายชื่อในฐานข้อมูล ({students.length})
          </h2>

          {loading ? (
            <p className="text-sm text-slate-500 text-center py-4 animate-pulse">
              กำลังโหลดข้อมูลจาก PostgreSQL...
            </p>
          ) : students.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              ยังไม่มีข้อมูลนักเรียนในระบบ
            </p>
          ) : ( //เมื่อโหลดเสร็จ
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/80 text-slate-400">
                  <tr>
                    <th className="p-3">ชื่อ - นามสกุล</th>
                    <th className="p-3">อีเมล</th>
                    <th className="p-3">เบอร์โทรศัพท์</th>
                    <th className="p-3">UUID (studentID)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {students.map((student) => (
                    <tr key={student.studentID} className="hover:bg-slate-700/30">
                      <td className="p-3 font-medium text-sky-400">{`${student.first_name || ''} ${student.last_name || ''}`.trim() || '-'}</td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3">{student.number || '-'}</td>
                      <td className="p-3 font-mono text-xs text-slate-500 truncate max-w-[120px]">
                        {student.studentID}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}

export default Administator;