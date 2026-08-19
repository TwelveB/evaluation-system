// ==========================================
// 1. IMPORT LIBRARIES & HOOKS
// ==========================================
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import เป็นฟังก์ชันตรงๆ

function Evaluate() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCriteriaAndScores = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/assessor/evaluation-criteria/${id}`);
      if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');
      
      const data = await res.json();
      setCriteria(data);

      const initialScores = {};
      const initialComments = {};
      
      data.forEach((item) => {
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCriteriaAndScores();
    }
  }, [id]);

  const handleScoreChange = (criterionId, val) => {
    setScores((prev) => ({ ...prev, [criterionId]: val }));
  };

  const handleCommentChange = (criterionId, val) => {
    setComments((prev) => ({ ...prev, [criterionId]: val }));
  };

  // ==========================================
  // ฟังก์ชันสร้างและดาวน์โหลดไฟล์ PDF
  // ==========================================
const exportToPDF = () => {
    const doc = new jsPDF();

    // หัวข้อเอกสาร
    doc.setFontSize(18);
    doc.text('Evaluation Result Report', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Evaluation Round ID: ${id}`, 14, 28);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 34);

    // จัดเตรียมข้อมูลสำหรับตาราง PDF
    const tableRows = criteria.map((item, idx) => {
      const currentScore = scores[item.criterion_id];
      const displayScore = currentScore !== undefined && currentScore !== null 
        ? currentScore 
        : 'N/A';
      
      return [
        idx + 1,
        item.title || '-',
        item.weight || 1,
        displayScore,
        comments[item.criterion_id] || '-'
      ];
    });

    // เรียกใช้ autoTable(doc, options) แทน doc.autoTable(...)
    autoTable(doc, {
      startY: 40,
      head: [['#', 'Criterion', 'Weight', 'Score', 'Comment']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 70 },
      },
    });

    // คำนวณสรุปผลคะแนนรวม
    const totalScore = criteria.reduce((sum, item) => {
      const s = parseFloat(scores[item.criterion_id]) || 0;
      return sum + s;
    }, 0);

    // อ่านค่าตำแหน่ง Y สุดท้ายของตาราง (ถ้าใช้ autoTable ตรงๆ ให้ดึงจาก doc.lastAutoTable)
    const finalY = (doc.lastAutoTable?.finalY || 40) + 10;
    doc.setFontSize(12);
    doc.text(`Total Score: ${totalScore.toFixed(2)}`, 14, finalY);

    // บันทึกไฟล์ PDF
    doc.save(`Evaluation_Report_${id}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = criteria.map((c) => ({
      evaluation_id: parseInt(id),
      criterion_id: c.criterion_id,
      score: scores[c.criterion_id] !== undefined ? parseFloat(scores[c.criterion_id]) : null,
      comment: comments[c.criterion_id] || ''
    }));

    try {
      const res = await fetch('http://localhost:5000/api/assessor/save-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: payload })
      });

      if (!res.ok) throw new Error('บันทึกไม่สำเร็จ');

      alert('บันทึกผลการประเมินเรียบร้อยแล้ว');
      navigate('/Assessor/StudentList');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-white">กำลังโหลดข้อมูล...</div>;
  if (errorMsg) return <div className="p-6 text-rose-400">{errorMsg}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-400">แบบประเมินผลการทำงาน</h1>
        
        {/* ปุ่มสร้างและส่งออกไฟล์ PDF */}
        <button
          type="button"
          onClick={exportToPDF}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow transition"
        >
          📄 ส่งออก PDF
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {criteria.map((item, idx) => (
          <div key={item.criterion_id} className="p-4 bg-slate-800 border border-slate-700 rounded-xl">
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
    </div>
  );
}

export default Evaluate;