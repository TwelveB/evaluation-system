import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

function Evaluate() {
  // ดึงค่าพารามิเตอร์ id จาก URL (เช่น id ของการประเมิน)
  const { id } = useParams();
  // ใช้สำหรับนำทางหรือเปลี่ยนหน้าต่าง ๆ ในแอปพลิเคชัน
  const navigate = useNavigate();
  // ใช้สำหรับอ้างอิงไปยัง DOM element ที่จะถูกนำไปสร้างเป็นไฟล์ PDF
  const printRef = useRef(null);

  // ประกาศ State เพื่อใช้เก็บข้อมูลสถานะต่าง ๆ ในระบบ
  const [criteria, setCriteria] = useState([]); // เก็บรายการเกณฑ์การประเมิน
  const [scores, setScores] = useState({}); // เก็บข้อมูลคะแนนที่ผู้ประเมินกรอก (Key: criterion_id, Value: score)
  const [comments, setComments] = useState({}); // เก็บข้อมูลข้อเสนอแนะที่ผู้ประเมินกรอก
  const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์ PDF ที่ผู้ใช้เลือกอัปโหลด
  const [existingDocPath, setExistingDocPath] = useState(null); // เก็บพาธ (Path) ของไฟล์เอกสารเดิมที่มีอยู่ในระบบ
  const [loading, setLoading] = useState(true); // สถานะระหว่างดึงข้อมูลจาก API
  const [saving, setSaving] = useState(false); // สถานะระหว่างส่งข้อมูลไปบันทึก
  const [errorMsg, setErrorMsg] = useState(''); // เก็บข้อความแจ้งเตือนข้อผิดพลาด

  // ฟังก์ชันสำหรับดึงข้อมูลเกณฑ์การประเมินและคะแนนเดิมจากฐานข้อมูลผ่าน API
  const fetchCriteriaAndScores = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/assessor/evaluation-criteria/${id}`);
      if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');
      
      const data = await res.json();
      
      // อัปเดตข้อมูลเกณฑ์การประเมินและไฟล์เอกสารลงใน State
      setCriteria(data.criteria || []);
      setExistingDocPath(data.document_path || null);

      const initialScores = {};
      const initialComments = {};
      
      // ตรวจสอบว่าถ้าเคยมีการให้คะแนนหรือคอมเมนต์มาก่อนหน้านี้ ให้นำมาตั้งเป็นค่าเริ่มต้น
      (data.criteria || []).forEach((item) => {
        if (item.score !== null && item.score !== undefined) {
          initialScores[item.criterion_id] = item.score;
        }
        if (item.comment) {
          initialComments[item.criterion_id] = item.comment;
        }
      });

      setScores(initialScores);
      setComments(initialComments);
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      // เมื่อดึงข้อมูลสำเร็จหรือเกิดข้อผิดพลาด ให้หยุดสถานะ Loading
      setLoading(false);
    }
  };

  // เรียกใช้งานฟังก์ชัน fetchCriteriaAndScores ครั้งแรกที่คอมโพเนนต์ถูกเรนเดอร์ หรือเมื่อ id เปลี่ยนไป
  useEffect(() => {
    if (id) {
      fetchCriteriaAndScores();
    }
  }, [id]);

  // ฟังก์ชันอัปเดต State ของ scores เมื่อผู้ใช้คลิกเลือกคะแนน
  const handleScoreChange = (criterionId, val) => {
    setScores((prev) => ({ ...prev, [criterionId]: val }));
  };

  // ฟังก์ชันอัปเดต State ของ comments เมื่อผู้ใช้พิมพ์ข้อเสนอแนะ
  const handleCommentChange = (criterionId, val) => {
    setComments((prev) => ({ ...prev, [criterionId]: val }));
  };

  // ฟังก์ชันจัดการการอัปโหลดไฟล์ ตรวจสอบว่าเป็นไฟล์ PDF เท่านั้น
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('กรุณาเลือกเฉพาะไฟล์ PDF เท่านั้น');
      e.target.value = null; // รีเซ็ตค่า input หากไฟล์ไม่ใช่ PDF
    }
  };

  // ฟังก์ชันคำนวณคะแนนรวมทั้งหมดที่ผู้ใช้ได้เลือกไว้
  const calculateTotalScore = () => {
    return criteria.reduce((sum, item) => {
      const s = parseFloat(scores[item.criterion_id]) || 0;
      return sum + s;
    }, 0);
  };

  // ฟังก์ชันสำหรับแปลงข้อมูลในหน้าจอ (ส่วน printRef) ให้กลายเป็นรูปภาพแล้วส่งออกเป็นไฟล์ PDF
  const exportToPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      // ใช้ html2canvas วาด DOM element ให้ออกมาเป็นรูปภาพ (Canvas)
      const canvas = await html2canvas(element, {
        scale: 2, // เพิ่มความละเอียดภาพ
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // สร้างเอกสาร PDF แนวตั้ง ขนาด A4
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ตารางสรุปผลการประเมิน_${id}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    }
  };

  // ฟังก์ชันส่งข้อมูลการประเมินทั้งหมด (รวมถึงไฟล์เอกสาร) ไปยัง API เพื่อบันทึกลงฐานข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บเมื่อกด Submit
    setSaving(true);

    // จัดเตรียมข้อมูลคะแนนและข้อเสนอแนะให้อยู่ในรูปแบบอาร์เรย์
    const scoresPayload = criteria.map((c) => ({
      criterion_id: c.criterion_id,
      score: scores[c.criterion_id] !== undefined ? parseFloat(scores[c.criterion_id]) : null,
      comment: comments[c.criterion_id] || ''
    }));

    // เนื่องจากมีการอัปโหลดไฟล์ จึงต้องส่งข้อมูลในรูปแบบ FormData แทน JSON ปกติ
    const formData = new FormData();
    formData.append('evaluation_id', id);
    formData.append('scores', JSON.stringify(scoresPayload));
    
    // ถ้าผู้ใช้เลือกไฟล์ใหม่ ให้แนบไฟล์ไปด้วย
    if (selectedFile) {
      formData.append('document', selectedFile);
    }

    try {
      const res = await fetch('http://localhost:5000/api/assessor/save-scores', {
        method: 'POST',
        body: formData // ส่ง Request เป็น FormData
      });

      if (!res.ok) throw new Error('บันทึกไม่สำเร็จ');

      alert('บันทึกผลการประเมินและแนบไฟล์เรียบร้อยแล้ว');
      // ย้อนกลับไปหน้าตรวจสอบรายชื่อนักศึกษา
      navigate('/Assessor/StudentList');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  // แสดงผลลัพธ์ระหว่างรอโหลด หรือหากเกิดข้อผิดพลาด
  if (loading) return <div className="p-6 text-white">กำลังโหลดข้อมูล...</div>;
  if (errorMsg) return <div className="p-6 text-rose-400">{errorMsg}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-slate-200">
      {/* ส่วนหัวเรื่องและปุ่มส่งออกรายงาน PDF */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-400">แบบประเมินผลการทำงาน</h1>
        
        <button
          type="button"
          onClick={exportToPDF}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow"
        >
          📄 ออกรายงานสรุป (PDF)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mb-12">
        {/* ========================================== */}
        {/* ส่วนอัปโหลด / แสดงไฟล์เอกสารหลักฐาน */}
        {/* ========================================== */}
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            📎 เอกสารหลักฐานการประเมิน (PDF 1 ไฟล์ต่อการประเมิน):
          </label>
          
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
          />

          {/* แสดงลิงก์เพื่อเปิดดูไฟล์ หากเคยมีการอัปโหลดไฟล์ไว้แล้ว */}
          {existingDocPath && (
            <div className="pt-2 text-xs text-slate-300 flex items-center gap-2">
              <span>เอกสารหลักฐานปัจจุบัน:</span>
              <a
                href={`http://localhost:5000${existingDocPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-1 font-medium"
              >
                📥 เปิดดูไฟล์หลักฐานเดิม
              </a>
            </div>
          )}
        </div>

        {/* ส่วนรายการเกณฑ์การประเมิน: ทำการลูปเพื่อเรนเดอร์ UI ตามจำนวนเกณฑ์ */}
        {criteria.map((item, idx) => (
          <div key={item.criterion_id} className="p-4 bg-slate-800 border border-slate-700 rounded-xl">
            {/* แสดงชื่อและน้ำหนักของแต่ละเกณฑ์ */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-white">
                {idx + 1}. {item.title}
              </h3>
              <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                น้ำหนัก: {item.weight}
              </span>
            </div>
            
            {item.description && (
              <p className="text-xs text-slate-400 mb-4">{item.description}</p>
            )}

            <div className="mb-3">
              <label className="block text-xs font-medium text-slate-300 mb-2">ให้คะแนน:</label>
              
              {/* ตรวจสอบประเภทการประเมิน ว่าเป็นแบบเลือกใช่/ไม่ใช่ (YES_NO) หรือระบุคะแนนตามช่วง */}
              {item.evaluation_type === 'YES_NO' ? (
                <div className="flex gap-4">
                  {[
                    { label: 'ไม่มี (0)', val: 0 },
                    { label: 'มี (1)', val: 1 }
                  ].map((opt) => (
                    <label key={opt.val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name={`score_${item.criterion_id}`}
                        value={opt.val}
                        checked={Number(scores[item.criterion_id]) === opt.val}
                        onChange={(e) => handleScoreChange(item.criterion_id, e.target.value)}
                        className="text-blue-500"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex gap-3">
                  {/* สร้างตัวเลือก Radio Button ตั้งแต่คะแนนต่ำสุด (min_score) จนถึงสูงสุด (max_score) */}
                  {Array.from(
                    { length: item.max_score - item.min_score + 1 },
                    (_, i) => item.min_score + i
                  ).map((val) => (
                    <label key={val} className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name={`score_${item.criterion_id}`}
                        value={val}
                        checked={Number(scores[item.criterion_id]) === val}
                        onChange={(e) => handleScoreChange(item.criterion_id, e.target.value)}
                        className="text-blue-500"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ส่วนกล่องข้อความสำหรับรับข้อเสนอแนะเพิ่มเติม */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                ความคิดเห็น / ข้อเสนอแนะ:
              </label>
              <textarea
                rows={2}
                value={comments[item.criterion_id] || ''}
                onChange={(e) => handleCommentChange(item.criterion_id, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="ระบุความคิดเห็น..."
              />
            </div>
          </div>
        ))}

        {/* ปุ่มกดยกเลิก หรือ ส่งข้อมูลการประเมิน */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            ยกเลิก
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? 'กำลังบันทึก...' : 'บันทึกการประเมิน'}
          </button>
        </div>
      </form>

      {/* ========================================== */}
      {/* ตารางสรุปสำหรับออก PDF */}
      {/* ส่วนนี้จะถูกซ่อนจากหน้าจอปกติด้วย overflow-hidden h-0 w-0 แต่นำไปใช้กับฟังก์ชัน exportToPDF */}
      {/* ========================================== */}
      <div className="overflow-hidden h-0 w-0">
        <div 
          ref={printRef} 
          style={{ width: '800px', backgroundColor: '#ffffff', color: '#000000', padding: '32px', fontFamily: 'sans-serif' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>สรุปผลการประเมิน</h2>
            <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
              รหัสการประเมิน: {id} | วันที่: {new Date().toLocaleDateString('th-TH')}
            </p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #d1d5db', width: '8%' }}>#</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #d1d5db', width: '42%' }}>ตัวชี้วัด</th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #d1d5db', width: '12%' }}>น้ำหนัก</th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #d1d5db', width: '12%' }}>คะแนน</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #d1d5db', width: '26%' }}>ข้อเสนอแนะ</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((item, idx) => (
                <tr key={item.criterion_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #d1d5db' }}>{idx + 1}</td>
                  <td style={{ padding: '10px', border: '1px solid #d1d5db' }}>{item.title}</td>
                  <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #d1d5db' }}>{item.weight}</td>
                  <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 'bold' }}>
                    {scores[item.criterion_id] !== undefined ? scores[item.criterion_id] : '-'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #d1d5db', fontSize: '12px' }}>
                    {comments[item.criterion_id] || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f9fafb', fontWeight: 'bold' }}>
                <td colSpan={3} style={{ padding: '12px', textAlign: 'right', border: '1px solid #d1d5db' }}>
                  คะแนนรวมทั้งหมด:
                </td>
                <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #d1d5db', color: '#2563eb', fontSize: '16px' }}>
                  {calculateTotalScore()}
                </td>
                <td style={{ border: '1px solid #d1d5db' }}></td>
              </tr>
            </tfoot>
          </table>

          {/* ส่วนสำหรับให้ผู้ประเมินเซ็นชื่อรับรอง */}
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ borderBottom: '1px solid #000', marginBottom: '8px', height: '40px' }}></div>
              <p style={{ fontSize: '14px', margin: 0 }}>ลงชื่อผู้ประเมิน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Evaluate;