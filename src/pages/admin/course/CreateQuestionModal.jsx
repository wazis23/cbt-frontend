import { useState } from "react";
import api from "../../../api/api";

export default function CreateQuestionModal({ courseId, categories, onClose, onSuccess }) {

  const [form, setForm] = useState({
    question: "",
    category_id: "",
    type: "mcq",
    explanation: ""
  });

  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState([]);
  const [pairs, setPairs] = useState([{ left: "", right: "" }]);

  const addOption = () => setOptions([...options, ""]);
  const addPair = () => setPairs([...pairs, { left: "", right: "" }]);

  const toggleCorrect = (i) => {
    if (form.type === "multiple") {
      setCorrect(prev =>
        prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
      );
    } else {
      setCorrect([i]);
    }
  };

  const validate = () => {
    if (!form.question) return alert("Question wajib diisi");

    if (!form.category_id) return alert("Kategori wajib");

    if (["mcq", "multiple"].includes(form.type)) {
      if (options.length < 4) return alert("Minimal 4 pilihan");

      if (options.some(o => !o.trim())) return alert("Option tidak boleh kosong");

      if (correct.length === 0) return alert("Pilih jawaban benar");
    }

    if (form.type === "short_answer" && !correct[0]) {
      return alert("Jawaban wajib diisi");
    }

    if (form.type === "kprime" && correct.length !== options.length) {
      return alert("Semua pernyataan harus ada True/False");
    }

    return true;
  };

  const save = async () => {
    if (!validate()) return;

    let payload = {
      question: form.question,
      category_id: form.category_id,
      type: form.type,
      explanation: form.explanation,
      course_id: courseId
    };

    // ================= TYPE HANDLER =================

    if (["mcq", "multiple"].includes(form.type)) {
      payload.options = options;
      payload.correct_answer =
        form.type === "mcq"
          ? correct[0]
          : correct;
    }

    if (form.type === "true_false") {
      payload.options = ["True", "False"];
      payload.correct_answer = correct[0] ?? 0;
    }

    if (form.type === "short_answer" || form.type === "essay") {
      payload.correct_answer = correct[0] || "";
    }

    if (form.type === "kprime") {
      payload.options = options;
      payload.correct_answer = options.map((_, i) => !!correct[i]);
    }

    if (form.type === "fill_blank") {
      payload.correct_answer = correct.map(x => x.trim());
    }

    if (form.type === "matching") {
      payload.meta = pairs.filter(p => p.left && p.right);
    }

    if (form.type === "drag_drop") {
      payload.options = options.filter(o => o.trim());
      payload.correct_answer = payload.options;
    }

    await api.post(`/admin/questions`, payload);

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white p-6 w-[800px] max-h-[90vh] overflow-auto">

        <h3 className="font-bold mb-4">Create Question</h3>

        {/* QUESTION */}
        <textarea
          placeholder="Question"
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />

        {/* CATEGORY */}
        <select
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Pilih kategori</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* TYPE */}
        <select
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="mcq">MCQ</option>
          <option value="multiple">Multiple Answer</option>
          <option value="true_false">True / False</option>
          <option value="short_answer">Short Answer</option>
          <option value="essay">Essay</option>
          <option value="kprime">K-Prime</option>
          <option value="fill_blank">Fill Blank</option>
          <option value="matching">Matching</option>
          <option value="drag_drop">Drag & Drop</option>
        </select>

        {/* ================= UI ================= */}

        {(form.type === "mcq" || form.type === "multiple") && (
          <>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="border p-2 flex-1"
                  value={opt}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => {
                    const o = [...options];
                    o[i] = e.target.value;
                    setOptions(o);
                  }}
                />

                <input
                  type={form.type === "mcq" ? "radio" : "checkbox"}
                  checked={correct.includes(i)}
                  onChange={() => toggleCorrect(i)}
                />
              </div>
            ))}
            <button onClick={addOption}>+ Option</button>
          </>
        )}

        {form.type === "true_false" && (
          <div className="flex gap-3">
            <button onClick={() => setCorrect([0])}>True</button>
            <button onClick={() => setCorrect([1])}>False</button>
          </div>
        )}

        {(form.type === "short_answer" || form.type === "essay") && (
          <input
            placeholder="Answer"
            className="border p-2 w-full"
            onChange={(e) => setCorrect([e.target.value])}
          />
        )}

        {form.type === "kprime" && (
          <>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="border p-2 flex-1"
                  placeholder={`Statement ${i + 1}`}
                  onChange={(e) => {
                    const o = [...options];
                    o[i] = e.target.value;
                    setOptions(o);
                  }}
                />

                <select
                  onChange={(e) => {
                    const c = [...correct];
                    c[i] = e.target.value === "true";
                    setCorrect(c);
                  }}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            ))}
          </>
        )}

        {form.type === "fill_blank" && (
          <input
            placeholder="Jawaban dipisah koma"
            className="border p-2 w-full"
            onChange={(e) => setCorrect(e.target.value.split(","))}
          />
        )}

        {form.type === "matching" && (
          <>
            {pairs.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  placeholder="Left"
                  className="border p-2"
                  onChange={(e)=>{
                    const x=[...pairs]; x[i].left=e.target.value; setPairs(x);
                  }}
                />
                <input
                  placeholder="Right"
                  className="border p-2"
                  onChange={(e)=>{
                    const x=[...pairs]; x[i].right=e.target.value; setPairs(x);
                  }}
                />
              </div>
            ))}
            <button onClick={addPair}>+ Pair</button>
          </>
        )}

        {form.type === "drag_drop" && (
          <>
            {options.map((opt, i) => (
              <input
                key={i}
                className="border p-2 mb-2 w-full"
                placeholder={`Item ${i + 1}`}
                onChange={(e)=>{
                  const o=[...options]; o[i]=e.target.value; setOptions(o);
                }}
              />
            ))}
          </>
        )}

        {/* EXPLANATION */}
        <textarea
          placeholder="Explanation"
          className="border p-2 w-full mt-3"
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
        />

        <button onClick={save} className="bg-green-600 text-white px-4 py-2 mt-3">
          Save
        </button>

        <button onClick={onClose} className="ml-2">
          Cancel
        </button>

      </div>
    </div>
  );
}