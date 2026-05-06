import { useEffect, useState } from "react";
import api from "../../api/api";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Exams() {

  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    course_id: "",
    title: "",
    duration: 60,
    start_time: "",
    end_time: ""
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const ex = await api.get("/admin/exams");
    const cs = await api.get("/admin/list-courses");

    setExams(ex.data);
    setCourses(cs.data);
  };

  const create = async () => {
    await api.post("/admin/exams", form);
    alert("Exam dibuat");
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Exam</h2>

      {/* FORM */}
      <div className="bg-white p-5 rounded shadow mb-6 w-[400px]">

        <select className="w-full border p-2 mb-2"
          onChange={e => setForm({...form, course_id:e.target.value})}>
          <option>Pilih Course</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input placeholder="Judul"
          className="w-full border p-2 mb-2"
          onChange={e => setForm({...form, title:e.target.value})}
        />

        <input type="number"
          className="w-full border p-2 mb-2"
          placeholder="Durasi (menit)"
          onChange={e => setForm({...form, duration:e.target.value})}
        />

        <input type="datetime-local"
          className="w-full border p-2 mb-2"
          onChange={e => setForm({...form, start_time:e.target.value})}
        />

        <input type="datetime-local"
          className="w-full border p-2 mb-2"
          onChange={e => setForm({...form, end_time:e.target.value})}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={create}
        >
          Buat Exam
        </button>
      </div>

      {/* LIST */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Judul</th>
            <th className="p-2">Durasi</th>
          </tr>
        </thead>

        <tbody>
          {exams.map(e => (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.title}</td>
              <td className="p-2">{e.duration} menit</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}