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
      navigate('/Administator/'); 
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

  useEffect(() => {
    fetchStudents();
  }, []);

  
  return (
  <div className="">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">หน้าเพิ่มข้อมูลนักเรียน</h1>
        <h2 className="text-slate-400">พร้อมบันทึกข้อมูลของนักเรียน</h2>

          <input
                type="text"
                name="email" //ต้องเป็นชื่อเดียวกับใน form เพราะอะไรไปดูในฟังก์ชั่น handlechange
                value={formData.email}
                onChange={handleChange}
                placeholder="อีเมล"
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
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="เบอร์โทรศัพท์"
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