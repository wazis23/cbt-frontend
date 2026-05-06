import { useState } from "react";
import api from "../../api/api";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Questions() {

  const [form, setForm] = useState({
    exam_session_id: "",
    question: "",
    options: ["", "", "", ""],
    correct_answer: ""
  });

  const create = async () => {
    await api.post("/admin/questions", form);
    alert("Soal ditambahkan");
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">Buat Soal</h2>

      <div className="bg-white p-5 rounded shadow w-[400px]">

        <input placeholder="Exam ID"
          className="w-full border p-2 mb-2"
          onChange={e => setForm({...form, exam_session_id:e.target.value})}
        />

        <textarea placeholder="Soal"
          className="w-full border p-2 mb-2"
          onChange={e => setForm({...form, question:e.target.value})}
        />

        {form.options.map((opt, i) => (
          <input key={i}
            placeholder={`Option ${i+1}`}
            className="w-full border p-2 mb-2"
            onChange={e => {
              const newOpt = [...form.options];
              newOpt[i] = e.target.value;
              setForm({...form, options: newOpt});
            }}
          />
        ))}

        <input placeholder="Jawaban benar"
          className="w-full border p-2 mb-2"
          onChange={e => setForm({...form, correct_answer:e.target.value})}
        />

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={create}
        >
          Simpan Soal
        </button>

      </div>
    </DashboardLayout>
  );
}