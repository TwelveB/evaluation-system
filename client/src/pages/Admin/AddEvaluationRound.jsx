import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEvaluationRound() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [assessors, setAssessors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: 'การประเมินผลการทำงาน',
    student_id: '',
    assessor_id: '',
    evaluation_date: new Date().toISOString().split('T')[0],
  });

  // โหลดรายชื่อนักเรียนและผู้ประเมินเพื่อทำตัวเลือก (Select Options)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStudents, resAssessors] = await Promise.all([
          fetch('http://localhost:5000/api/students'),
          fetch('http://localhost:5000/api/assessor')
        ]);

        if (resStudents.ok) setStudents(await resStudents.json());
        if (resAssessors.ok) setAssessors(await resAssessors.json());
      } catch (err) {
        console.error('Error loading dropdown options:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.student_id || !formData.assessor_id || !formData.title.trim()) {
      setErrorMsg('กรุณากรอกข้อมูลและเลือกนักเรียน/ผู้ประเมินให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/admins/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'ไม่สามารถสร้างรอบการประเมินได้');

      alert('สร้างรอบการประเมินให้นักเรียนเรียบร้อยแล้ว');
      setFormData({
        title: 'การประเมินผลการทำงาน',
        student_id: '',
        assessor_id: '',
        evaluation_date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6 text-slate-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-sky-400">เพิ่มรอบการประเมินนักเรียน</h1>
          <p className="text-sm text-slate-400">มอบหมายผู้ประเมินและตั้งค่ารอบการประเมินให้นักเรียน</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg"
        >
          ย้อนกลับ
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
        {errorMsg && <p className="text-rose-400 text-sm">{errorMsg}</p>}

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">ชื่อรอบการประเมิน *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="เช่น การประเมินครั้งที่ 1, การประเมินปลายภาค"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">เลือกนักเรียน *</label>
          <select
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            required
          >
            <option value="">-- เลือกนักเรียน --</option>
            {students.map((s) => (
              <option key={s.studentID} value={s.studentID}>
                {s.student_code} - {s.first_name} {s.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">เลือกผู้ประเมิน (Assessor) *</label>
          <select
            name="assessor_id"
            value={formData.assessor_id}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            required
          >
            <option value="">-- เลือกผู้ประเมิน --</option>
            {assessors.map((a) => (
              <option key={a.assessor_id || a.id} value={a.assessor_id || a.id}>
                {a.first_name} {a.last_name} ({a.department || 'ไม่ระบุแผนก'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">วันที่ประเมิน</label>
          <input
            type="date"
            name="evaluation_date"
            value={formData.evaluation_date}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'สร้างรอบการประเมิน'}
        </button>
      </form>
    </div>
  );
}

export default AddEvaluationRound;