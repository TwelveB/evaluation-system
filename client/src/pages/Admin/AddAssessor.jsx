import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  //สำหรับเก็บข้อมูลก่อนส่งไปบันทึก
  // student_code, password, first_name, last_name, phone_number, department 
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    department: '',
  });

  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.username.trim() || 
    !formData.password.trim() ||
    !formData.first_name.trim() ||
    !formData.last_name.trim()
    ) {
      setErrorMsg('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assessor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      // console.log(result);

      if (!res.ok) {
        setErrorMsg(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        setIsSubmitting(false);
        return;
      }
      setFormData({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        department: '',
      });
      console.log("บันทึกข้อมูลสำเร็จ");
      // navigate('/Administator/'); 
    } catch (err) {
      console.error('Error adding student:', err);
      setErrorMsg('ไม่สามารถเชื่อมต่อกับ Server ได้');
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const GoBack = () => {
    navigate(-1);
  };

  
  return (
  <div className="">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">หน้าเพิ่มข้อมูลนักเรียน</h1>
        <h2 className="text-slate-400">พร้อมบันทึกข้อมูลของนักเรียน</h2>

          <input
                type="text"
                name="username" //ต้องเป็นชื่อเดียวกับใน form เพราะอะไรไปดูในฟังก์ชั่น handlechange
                value={formData.username}
                onChange={handleChange}
                placeholder="ชื่อผู้ใช้งานของผู้ประเมิน"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                required 
          />
          <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="รหัสผ่าน"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                required
          />
          <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="ชื่อจริง"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                required
          />
          <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="นามสกุล"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                required
          />
          <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="เบอร์โทรศัพท์"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                required
          />
          <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="กลุ่ม/คลาส/โรงเรียนของนักเรียน"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                required
          />
          <button className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={handleSubmit}
          >
            ยืนยัน
          </button>
          <br></br>
          <button className="mt-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            type="ย้อนกลับ"
            onClick={GoBack}
          >
            ย้อนกลับ
          </button>
        </div>
  );
}

export default AddStudent;