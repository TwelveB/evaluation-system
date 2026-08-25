import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCriteria() {
  const navigate = useNavigate();
  const [criteriaList, setCriteriaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weight: 1,
    evaluation_type: 'SCALE', // 'SCALE' หรือ 'YES_NO'
    min_score: 1,
    max_score: 5,
  });

  const fetchCriteria = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admins/criteria`);
      if (res.ok) {
        const data = await res.json();
        setCriteriaList(data);
      }
    } catch (err) {
      console.error('Error fetching criteria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('กรุณากรอกชื่อตัวชี้วัด');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        weight: parseFloat(formData.weight),
        min_score: formData.evaluation_type === 'YES_NO' ? 0 : parseInt(formData.min_score),
        max_score: formData.evaluation_type === 'YES_NO' ? 1 : parseInt(formData.max_score),
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admins/criteria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'ไม่สามารถเพิ่มตัวชี้วัดได้');
      }

      alert('เพิ่มตัวชี้วัดสำเร็จ');
      setFormData({
        title: '',
        description: '',
        weight: 1,
        evaluation_type: 'SCALE',
        min_score: 1,
        max_score: 5,
      });
      fetchCriteria();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-6 text-slate-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-sky-400">เพิ่มตัวชี้วัด (Evaluation Criteria)</h1>
          <p className="text-sm text-slate-400">จัดการเกณฑ์และน้ำหนักคะแนนสำหรับการประเมิน</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg"
        >
          ย้อนกลับ
        </button>
      </div>

      {/* ฟอร์มเพิ่มตัวชี้วัด */}
      <form onSubmit={handleSubmit} className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-4">
        {errorMsg && <p className="text-rose-400 text-sm">{errorMsg}</p>}

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">ชื่อตัวชี้วัด *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="เช่น ความตรงต่อเวลา, ทักษะการสื่อสาร"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">รายละเอียด/คำอธิบาย</label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            placeholder="คำอธิบายเกณฑ์การให้คะแนนเพิ่มเติม..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">น้ำหนักคะแนน (Weight)</label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">ประเภทการประเมิน</label>
            <select
              name="evaluation_type"
              value={formData.evaluation_type}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="SCALE">สเกลคะแนน (Scale)</option>
              <option value="YES_NO">ผ่าน / ไม่ผ่าน (Yes/No)</option>
            </select>
          </div>
        </div>

        {formData.evaluation_type === 'SCALE' && (
          <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <div>
              <label className="block text-xs text-slate-400 mb-1">คะแนนต่ำสุด (Min)</label>
              <input
                type="number"
                name="min_score"
                value={formData.min_score}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">คะแนนสูงสุด (Max)</label>
              <input
                type="number"
                name="max_score"
                value={formData.max_score}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-sm"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
        >
          {isSubmitting ? 'กำลังบันทึก...' : '+ เพิ่มตัวชี้วัด'}
        </button>
      </form>

      {/* ตารางแสดงตัวชี้วัดที่มีอยู่ */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-2">รายการตัวชี้วัดในระบบ ({criteriaList.length})</h3>
        {loading ? (
          <p className="text-xs text-slate-500 text-center py-4">กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 bg-slate-800 rounded-lg border border-slate-700">
              <thead className="bg-slate-900 uppercase text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-2.5">ชื่อตัวชี้วัด</th>
                  <th className="p-2.5">น้ำหนัก</th>
                  <th className="p-2.5">ประเภท</th>
                  <th className="p-2.5">ช่วงคะแนน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {criteriaList.map((item) => (
                  <tr key={item.criterion_id} className="hover:bg-slate-700/30">
                    <td className="p-2.5 font-medium text-white">{item.title}</td>
                    <td className="p-2.5">{item.weight}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-700">
                        {item.evaluation_type}
                      </span>
                    </td>
                    <td className="p-2.5">{item.min_score} - {item.max_score}</td>
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

export default AddCriteria;