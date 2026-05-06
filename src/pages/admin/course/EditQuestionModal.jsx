import { useState } from "react";
import api from "../../../api/api";

export default function EditQuestionModal({
  data,
  categories,
  onClose,
  onSuccess
}) {

  const [form, setForm] = useState({
    ...data
  });

  const [options, setOptions] = useState(data.options || ["", "", "", ""]);
  const [correct, setCorrect] = useState(
    Array.isArray(data.correct_answer)
      ? data.correct_answer
      : [data.correct_answer]
  );

  const addOption = () => setOptions([...options, ""]);

  const toggleCorrect = (i) => {
    if (form.type === "multiple") {
      setCorrect(prev =>
        prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
      );
    } else {
      setCorrect([i]);
    }
  };

  const save = async () => {

    let payload = {
      ...form,
      options,
      correct_answer:
        form.type === "multiple" ? correct : correct[0]
    };

    await api.put(`/admin/questions/${data.id}`, payload);

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white w-[700px] p-6 rounded shadow max-h-[90vh] overflow-auto">

        <h3 className="font-bold mb-4">Edit Question</h3>

        {/* QUESTION */}
        <textarea
          className="border p-2 w-full mb-3"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />

        {/* CATEGORY */}
        <select
          className="border p-2 w-full mb-3"
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* TYPE BASED UI */}

        {(form.type === "mcq" || form.type === "multiple") && (
          <>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="border p-2 flex-1"
                  value={opt}
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

            <button onClick={addOption} className="text-blue-600">
              + Option
            </button>
          </>
        )}

        {form.type === "true_false" && (
          <div className="flex gap-2">
            <button onClick={() => setCorrect([0])}>True</button>
            <button onClick={() => setCorrect([1])}>False</button>
          </div>
        )}

        {form.type === "short_answer" && (
          <input
            className="border p-2 w-full"
            value={correct[0] || ""}
            onChange={(e) => setCorrect([e.target.value])}
          />
        )}

        {form.type === "essay" && (
          <div className="text-gray-500">Essay (manual grading)</div>
        )}

        {/* EXPLANATION */}
        <textarea
          className="border p-2 w-full mt-3"
          value={form.explanation || ""}
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
        />

        {/* ACTION */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-400 px-4 py-2 text-white">
            Cancel
          </button>

          <button onClick={save} className="bg-green-600 px-4 py-2 text-white">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}