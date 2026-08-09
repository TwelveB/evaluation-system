import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  //สำหรับเก็บข้อมูลก่อนส่งไปบันทึก
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    number: '',
  });

  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email.trim()) {
      setErrorMsg('กรุณากรอกอีเมล');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        setErrorMsg(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        setIsSubmitting(false);
        return;
      }
      
      console.log("บันทึกข้อมูลสำเร็จ");
      navigate('/Administator/AddStudent'); 
    } catch (err) {
      console.error('Error adding student:', err);
      setErrorMsg('ไม่สามารถเชื่อมต่อกับ Server ได้');
      setIsSubmitting(false);
    } finally {
      
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-sm">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">หน้าเพิ่มข้อมูลนักเรียน</h1>
        <h2 className="text-slate-400">พร้อมบันทึกข้อมูลของนักเรียน</h2>

          <input
                type="text"
                name="email" //ต้องเป็นชื่อเดียวกับใน form เพราะอะไรไปดูในฟังก์ชั่น handlechange
                value={formData.email}
                onChange={handleChange}
                placeholder="อีเมล"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          />
          <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="รหัสผ่าน"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          />
          <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="ชื่อจริง"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          />
          <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="นามสกุล"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          />
          <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="เบอร์โทรศัพท์"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          />
          <button className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={handleSubmit}
          >
            Button
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
                    <th className="p-3">เลขที่</th>
                    <th className="p-3">ชื่อ - นามสกุล</th>
                    <th className="p-3">อีเมล</th>
                    <th className="p-3">UUID (studentID)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {students.map((student) => (
                    <tr key={student.studentID} className="hover:bg-slate-700/30">
                      <td className="p-3 font-medium text-sky-400">{student.number || '-'}</td>
                      <td className="p-3">{`${student.first_name || ''} ${student.last_name || ''}`.trim() || '-'}</td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3 font-mono text-xs text-slate-500 truncate max-w-[120px]">
                        {student.student_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddStudent;