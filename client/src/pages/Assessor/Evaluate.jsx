// ==========================================
// 1. IMPORT LIBRARIES & HOOKS
// ==========================================
import { useEffect, useState } from 'react';
// useParams: ใช้สำหรับดึงค่า parameter จาก URL (เช่น evaluation_id)
// useNavigate: ใช้สำหรับเปลี่ยนหน้าไปยัง Path อื่นๆ ในแอปพลิเคชัน
import { useParams, useNavigate } from 'react-router-dom';

function Evaluate() {
  // ==========================================
  // 2. INITIALIZE HOOKS & STATES
  // ==========================================
  // ดึงค่า id (evaluation_id) จาก URL เช่น /Assessor/StudentInfo/Evaluate/1 -> id จะได้ค่า 1
  const { id } = useParams();
  
  // สร้างฟังก์ชัน navigate สำหรับสั่งเปลี่ยนหน้าเว็บ
  const navigate = useNavigate();
  
  // State สำหรับเก็บรายการเกณฑ์การประเมิน (Array ของ Criteria ที่ดึงมาจาก Backend)
  const [criteria, setCriteria] = useState([]);
  
  // State สำหรับเก็บคะแนนที่ผู้ใช้เลือก โดยใช้ Key เป็น criterion_id -> รูปแบบ: { 1: 4, 2: 1, 3: 3 }
  const [scores, setScores] = useState({});
  
  // State สำหรับเก็บความคิดเห็น/ข้อเสนอแนะ โดยใช้ Key เป็น criterion_id -> รูปแบบ: { 1: "ทำงานดี", 2: "ส่งงานตรงเวลา" }
  const [comments, setComments] = useState({});
  
  // State ควบคุมสถานะการโหลดข้อมูล ( true = กำลังโหลด, false = โหลดเสร็จแล้ว )
  const [loading, setLoading] = useState(true);
  
  // State ควบคุมสถานะขณะกำลังบันทึกข้อมูลไปที่ Backend ( true = กำลังบันทึกเพื่อกดปิดปุ่มซ้ำ, false = ปกติ )
  const [saving, setSaving] = useState(false);
  
  // State สำหรับเก็บข้อความ Error กรณีเกิดปัญหาขณะดึงข้อมูล
  const [errorMsg, setErrorMsg] = useState('');

  // ==========================================
  // 3. API FETCHING FUNCTION (ดึงข้อมูล)
  // ==========================================
  // ฟังก์ชันดึงเกณฑ์การประเมินพร้อมคะแนนประเมินย้อนหลัง (ถ้ามี) จาก Backend
  const fetchCriteriaAndScores = async () => {
    try {
      // ยิง API แบบ GET เพื่อขอข้อมูลรายการตัวชี้วัดและคะแนนเดิม
      const res = await fetch(`http://localhost:5000/api/assessor/evaluation-criteria/${id}`);
      
      // ถ้าสถานะ Response ไม่สำเร็จ (!200 OK) ให้โยน Error ออกไป
      if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');
      
      // แปลงข้อมูลที่ได้จาก API ให้อยู่ในรูป JSON
      const data = await res.json();
      
      // บันทึกรายการเกณฑ์การประเมินลง State
      setCriteria(data);

      // สร้างวัตถุชั่วคราวเพื่อดึงคะแนนและคอมเมนต์เดิมที่มีอยู่แล้วมาใส่ไว้ก่อน
      const initialScores = {};
      const initialComments = {};
      
      // วนลูปเช็คข้อมูลแต่ละข้อที่ดึงมาจาก Backend
      data.forEach((item) => {
        // หากมีคะแนนเดิมอยู่แล้ว (ไม่เป็น null หรือ undefined) ให้ตั้งค่าเริ่มต้น
        if (item.score !== null && item.score !== undefined) {
          initialScores[item.criterion_id] = item.score; // เก็บลงคีย์ตาม criterion_id
        }
        // หากมีคอมเมนต์เดิมอยู่แล้ว ให้ตั้งค่าเริ่มต้น
        if (item.comment) {
          initialComments[item.criterion_id] = item.comment; // เก็บลงคีย์ตาม criterion_id
        }
      });

      // นำข้อมูลเริ่มต้นไปอัปเดตใส่ State
      setScores(initialScores);
      setComments(initialComments);
    } catch (err) {
      console.error(err);
      // แสดงข้อความแจ้งเตือนข้อผิดพลาดบนหน้าเว็บ
      setErrorMsg('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      // เมื่อทำงานเสร็จแล้ว (ไม่ว่าจะสำเร็จหรือล้มเหลว) ให้ปิดสถานะ Loading
      setLoading(false);
    }
  };

  // ==========================================
  // 4. USE EFFECT (ทำงานเมื่อโหลดหน้าเว็บ)
  // ==========================================
  // จะทำงานทันทีเมื่อคอมโพเนนต์ถูกโหลดขึ้นมา หรือเมื่อค่า `id` เปลี่ยนแปลง
  useEffect(() => {
    // ถ้ามีค่า id ส่งเข้ามา จึงจะทำสั่งเรียกฟังก์ชันดึงข้อมูล
    if (id) {
      fetchCriteriaAndScores();
    }
  }, [id]);

  // ==========================================
  // 5. EVENT HANDLERS (จัดการการเปลี่ยนแปลงในฟอร์ม)
  // ==========================================
  // ฟังก์ชันอัปเดต State คะแนนเมื่อผู้ใช้คลิกเลือก Radio Button
  const handleScoreChange = (criterionId, val) => {
    // ใช้รูปแบบ Callback อัปเดต Object เดิม โดยเพิ่ม/แก้ไขเฉพาะ Key ที่ตรงกับ criterionId
    setScores((prev) => ({ ...prev, [criterionId]: val }));
  };

  // ฟังก์ชันอัปเดต State ความคิดเห็นเมื่อผู้ใช้พิมพ์ในช่อง Textarea
  const handleCommentChange = (criterionId, val) => {
    // ใช้รูปแบบ Callback อัปเดต Object เดิม โดยเพิ่ม/แก้ไขเฉพาะ Key ที่ตรงกับ criterionId
    setComments((prev) => ({ ...prev, [criterionId]: val }));
  };

  // ==========================================
  // 6. SUBMIT HANDLER (การบันทึกข้อมูล)
  // ==========================================
  // ฟังก์ชันทำงานเมื่อผู้ใช้กดปุ่ม "บันทึกการประเมิน" (Submit Form)
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชตามพฤติกรรมปกติของ HTML Form
    setSaving(true);    // เปิดสถานะกำลังบันทึก (เพื่อ Disable ปุ่มกันกดซ้ำ)

    // แปลงโครงสร้างข้อมูลจาก State ให้เป็นรูปแบบ Array ของ JSON Object พร้อมส่งไป Backend
    const payload = criteria.map((c) => ({
      evaluation_id: parseInt(id), // แปลง ID การประเมินเป็น Integer
      criterion_id: c.criterion_id, // รหัสตัวชี้วัดข้อนั้นๆ
      // เช็คว่ามีการให้คะแนนไว้หรือไม่ ถ้ามีให้แปลงเป็น Float ถ้าไม่มีให้ส่ง null
      score: scores[c.criterion_id] !== undefined ? parseFloat(scores[c.criterion_id]) : null,
      comment: comments[c.criterion_id] || '' // ส่งความคิดเห็น หรือข้อความว่างถ้าไม่ได้พิมพ์
    }));

    try {
      // ส่งข้อมูลไปยัง API ฝั่ง Backend ด้วย Method POST
      const res = await fetch('http://localhost:5000/api/assessor/save-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: payload }) // แนบ Payload คะแนนเข้าไปใน Request Body
      });

      // หาก Backend ตอบกลับแบบไม่อนุมัติ (HTTP Status != 200-299)
      if (!res.ok) throw new Error('บันทึกไม่สำเร็จ');

      // แจ้งเตือนเมื่อบันทึกสำเร็จ แล้วนำผู้ใช้กลับไปยังหน้ารายชื่อนักเรียน
      alert('บันทึกผลการประเมินเรียบร้อยแล้ว');
      navigate('/Assessor/StudentList');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false); // ปิดสถานะการบันทึกเพื่อให้ปุ่มกลับมาใช้งานได้ปกติ
    }
  };

  // ==========================================
  // 7. RENDER CONDITIONAL UI (การแสดงผลตามเงื่อนไข)
  // ==========================================
  // แสดงหน้าข้อความ "กำลังโหลดข้อมูล..." ขณะที่ loading เป็น true
  if (loading) return <div className="p-6 text-white">กำลังโหลดข้อมูล...</div>;
  
  // แสดงข้อความ Error กรณีเกิดข้อผิดพลาดในการดึงข้อมูล
  if (errorMsg) return <div className="p-6 text-rose-400">{errorMsg}</div>;

  // ==========================================
  // 8. MAIN RENDER JSX (โครงสร้างหน้าจอปกติ)
  // ==========================================
  return (
    <div className="p-6 max-w-4xl mx-auto text-slate-200">
      {/* หัวข้อหน้าประเมิน */}
      <h1 className="text-2xl font-bold text-sky-400 mb-6">แบบประเมินผลการทำงาน</h1>
      
      {/* แบบฟอร์มประเมินผล */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* วนลูปสร้างการ์ดแบบประเมินรายข้อ ตามรายการ criteria ที่ดึงมาจาก DB */}
        {criteria.map((item, idx) => (
          <div key={item.criterion_id} className="p-4 bg-slate-800 border border-slate-700 rounded-xl">
            
            {/* หัวข้อตัวชี้วัดและน้ำหนักคะแนน */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-white">
                {idx + 1}. {item.title}
              </h3>
              <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                น้ำหนัก: {item.weight}
              </span>
            </div>
            
            {/* คำอธิบายเกณฑ์ (แสดงเฉพาะข้อที่มีข้อมูลคำอธิบาย) */}
            {item.description && (
              <p className="text-xs text-slate-400 mb-4">{item.description}</p>
            )}

            {/* ------------------------------------------ */}
            {/* ส่วนเลือกคะแนน (Dynamic Render ตามประเภทประเมิน) */}
            {/* ------------------------------------------ */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-slate-300 mb-2">ให้คะแนน:</label>
              
              {/* ตัวเลือกแบบ YES_NO (มี/ไม่มี) */}
              {item.evaluation_type === 'YES_NO' ? (
                <div className="flex gap-4">
                  {[
                    { label: 'ไม่มี (0)', val: 0 },
                    { label: 'มี (1)', val: 1 }
                  ].map((opt) => (
                    <label key={opt.val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name={`score_${item.criterion_id}`} // กำหนดชื่อกลุ่ม Radio ตามรหัสข้อเพื่อไม่ให้ตีกัน
                        value={opt.val}
                        checked={Number(scores[item.criterion_id]) === opt.val} // ตรวจสอบสถานะว่าเลือกปุ่มนี้หรือไม่
                        onChange={(e) => handleScoreChange(item.criterion_id, e.target.value)}
                        className="text-blue-500"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              ) : (
                /* ตัวเลือกแบบ Scale ระดับคะแนน (เช่น สเกล 1-4 หรือ 1-5) */
                <div className="flex gap-3">
                  {/* สร้าง Array ตัวเลขตั้งแต่ min_score ถึง max_score แบบอัตโนมัติ */}
                  {/* โดยการให้อาเรย์วนลปูจาก min_score ถึง max_score และสร้าง Radio Button สำหรับแต่ละตัวเลขตามคีย์ที่่อาเรย์สร้างไว้ด้วย (_, i) => item.min_score + i */}
                  {Array.from(
                    { length: item.max_score - item.min_score + 1 },
                    (_, i) => item.min_score + i
                  ).map((val) => (
                    <label key={val} className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name={`score_${item.criterion_id}`} // กำหนดชื่อกลุ่ม Radio ตามรหัสข้อ
                        value={val}
                        checked={Number(scores[item.criterion_id]) === val} // ตรวจสอบสถานะว่าเลือกตัวเลขนี้หรือไม่
                        onChange={(e) => handleScoreChange(item.criterion_id, e.target.value)}
                        className="text-blue-500"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ------------------------------------------ */}
            {/* ส่วนกรอกข้อเสนอแนะ / ความคิดเห็น */}
            {/* ------------------------------------------ */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                ความคิดเห็น / ข้อเสนอแนะ:
              </label>
              <textarea
                rows={2}
                value={comments[item.criterion_id] || ''} // ดึงค่าคอมเมนต์จาก State (ถ้าไม่มีให้เป็นข้อความว่าง)
                onChange={(e) => handleCommentChange(item.criterion_id, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="ระบุความคิดเห็น..."
              />
            </div>
          </div>
        ))}

        {/* ------------------------------------------ */}
        {/* ส่วนปุ่มดำเนินการ (Action Buttons) */}
        {/* ------------------------------------------ */}
        <div className="flex justify-end gap-3 pt-4">
          {/* ปุ่มยกเลิก: สั่งย้อนกลับไปหน้าก่อนหน้า 1 หน้า (-1) */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            ยกเลิก
          </button>
          
          {/* ปุ่มบันทึก: จะปิดใช้งาน (disabled) หากกำลังอยู่ในสถานะ saving */}
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? 'กำลังบันทึก...' : 'บันทึกการประเมิน'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Evaluate;