import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";

import CreateCategoryModal from "./CreateCategoryModal";
import CreateQuestionModal from "./CreateQuestionModal";
import ViewQuestionModal from "./ViewQuestionModal";
import ImportQuestionModal from "./ImportQuestionModal";
import EditQuestionModal from "./EditQuestionModal";

export default function QuestionsPage() {
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [viewing, setViewing] = useState(null);
  const [selected, setSelected] = useState([]);
    const [editing, setEditing] = useState(null);
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const c = await api.get(`/admin/courses/${id}/categories`);
    const q = await api.get(`/admin/questions?course_id=${id}`);

    setCategories(c.data);
    setQuestions(q.data.data || q.data);
  };

  // ================= DELETE =================
  const remove = async (qid) => {
    if (!confirm("Hapus soal?")) return;
    await api.delete(`/admin/questions/${qid}`);
    load();
  };

  const bulkDelete = async () => {
    if (!confirm(`Hapus ${selected.length} soal?`)) return;

    await Promise.all(
      selected.map(id => api.delete(`/admin/questions/${id}`))
    );

    setSelected([]);
    load();
  };

  // ================= SELECT =================
  const toggleSelect = (qid) => {
    setSelected(prev =>
      prev.includes(qid)
        ? prev.filter(id => id !== qid)
        : [...prev, qid]
    );
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map(q => q.id));
    }
  };

  // ================= FILTER =================
  const filtered = questions.filter(q =>
    q.question.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory ? q.category_id == filterCategory : true)
  );

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Question Bank</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Category
          </button>

          <button
            onClick={() => setShowQuestionModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Question
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Import
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded shadow mb-4 flex gap-2 items-center">
        <input
          placeholder="Search question..."
          className="border p-2 flex-1"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2"
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* SELECT ALL */}
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={selected.length === filtered.length && filtered.length > 0}
            onChange={toggleAll}
          />
          Select All
        </label>
      </div>

      {/* BULK ACTION */}
      {selected.length > 0 && (
        <div className="mb-4">
          <button
            onClick={bulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Selected ({selected.length})
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="grid gap-3">
        {filtered.map(q => (
          <div
            key={q.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">

              {/* LEFT */}
              <div className="flex gap-3">

                <input
                  type="checkbox"
                  checked={selected.includes(q.id)}
                  onChange={() => toggleSelect(q.id)}
                />

                <div>
                  <div className="font-semibold text-gray-800">
                    {q.question}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {q.category?.name} • {q.type}
                  </div>
                </div>

              </div>

              {/* ACTION */}
              <div className="flex gap-3 text-sm">

                <button
                  onClick={() => setViewing(q)}
                  className="text-green-600 hover:underline"
                >
                  View
                </button>
                <button
                    onClick={() => setEditing(q)}
                    className="text-blue-600 hover:underline"
                    >
                    Edit
                </button>
                <button
                  onClick={() => remove(q.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}

      {showCategoryModal && (
        <CreateCategoryModal
          courseId={id}
          onClose={() => setShowCategoryModal(false)}
          onSuccess={load}
        />
      )}

      {showQuestionModal && (
        <CreateQuestionModal
          courseId={id}
          categories={categories}
          onClose={() => setShowQuestionModal(false)}
          onSuccess={load}
        />
      )}

      {showImportModal && (
        <ImportQuestionModal
          courseId={id}
          categories={categories}
          onClose={() => setShowImportModal(false)}
          onSuccess={load}
        />
      )}

      {viewing && (
        <ViewQuestionModal
          data={viewing}
          onClose={() => setViewing(null)}
        />
      )}
      {editing && (
        <EditQuestionModal
            data={editing}
            categories={categories}
            onClose={() => setEditing(null)}
            onSuccess={load}
        />
        )}
    </div>
  );
}