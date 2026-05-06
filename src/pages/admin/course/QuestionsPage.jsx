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

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [categories, setCategories] = useState([]);

  const [questions, setQuestions] = useState([]);

  const [search, setSearch] = useState("");

  const [filterCategory, setFilterCategory] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const [showImportModal, setShowImportModal] = useState(false);

  const [viewing, setViewing] = useState(null);

  const [editing, setEditing] = useState(null);

  const [selected, setSelected] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    load();

  }, []);

  const load = async () => {

    const c = await api.get(
      `/admin/courses/${id}/categories`
    );

    const q = await api.get(
      `/admin/questions?course_id=${id}`
    );

    setCategories(c.data);

    setQuestions(q.data.data || q.data);
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const remove = async (qid) => {

    if (!confirm("Hapus soal?")) {
      return;
    }

    await api.delete(
      `/admin/questions/${qid}`
    );

    load();
  };

  const bulkDelete = async () => {

    if (
      !confirm(
        `Hapus ${selected.length} soal?`
      )
    ) {
      return;
    }

    await Promise.all(

      selected.map(id =>

        api.delete(
          `/admin/questions/${id}`
        )
      )
    );

    setSelected([]);

    load();
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT
  |--------------------------------------------------------------------------
  */

  const toggleSelect = (qid) => {

    setSelected(prev =>

      prev.includes(qid)

        ? prev.filter(id => id !== qid)

        : [...prev, qid]
    );
  };

  const toggleAll = () => {

    if (
      selected.length === filtered.length
    ) {

      setSelected([]);

    } else {

      setSelected(
        filtered.map(q => q.id)
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filtered = questions.filter(q =>

    q.question
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )

    &&

    (
      filterCategory

        ? q.category_id == filterCategory

        : true
    )
  );

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="text-orange-100 text-sm mb-2">
              CBT Question Bank
            </div>

            <h1 className="text-4xl font-bold">
              Question Bank
            </h1>

            <p className="text-orange-100 mt-3 max-w-2xl">
              Kelola seluruh bank soal,
              kategori,
              import excel,
              dan random question CBT.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl px-8 py-6">

            <div className="text-orange-100 text-sm">
              Total Questions
            </div>

            <div className="text-5xl font-bold mt-2">
              {questions.length}
            </div>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5">

        <StatCard
          title="Questions"
          value={questions.length}
          color="orange"
          icon="📚"
        />

        <StatCard
          title="Categories"
          value={categories.length}
          color="pink"
          icon="🗂️"
        />

        <StatCard
          title="Selected"
          value={selected.length}
          color="purple"
          icon="✅"
        />

      </div>

      {/* ACTION */}
      <div className="bg-white rounded-3xl shadow-sm border p-6">

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() =>
              setShowCategoryModal(true)
            }
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-2xl font-semibold"
          >
            + Category
          </button>

          <button
            onClick={() =>
              setShowQuestionModal(true)
            }
            className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-3 rounded-2xl font-semibold"
          >
            + Question
          </button>

          <button
            onClick={() =>
              setShowImportModal(true)
            }
            className="bg-purple-600 hover:bg-purple-700 transition text-white px-5 py-3 rounded-2xl font-semibold"
          >
            Import Excel
          </button>

        </div>

      </div>

      {/* FILTER */}
      <div className="bg-white rounded-3xl shadow-sm border p-6">

        <div className="grid lg:grid-cols-3 gap-4">

          <input
            placeholder="Search question..."
            className="border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition p-4 rounded-2xl outline-none"
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition p-4 rounded-2xl outline-none"
            onChange={(e) =>
              setFilterCategory(
                e.target.value
              )
            }
          >

            <option value="">
              All Category
            </option>

            {categories.map((c) => (

              <option
                key={c.id}
                value={c.id}
              >

                {c.name}

              </option>

            ))}

          </select>

          <label className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5">

            <input
              type="checkbox"
              checked={
                selected.length ===
                  filtered.length

                &&

                filtered.length > 0
              }
              onChange={toggleAll}
            />

            <span className="font-medium">
              Select All
            </span>

          </label>

        </div>

      </div>

      {/* BULK */}
      {selected.length > 0 && (

        <div className="bg-red-50 border border-red-200 rounded-3xl p-5 flex justify-between items-center">

          <div className="font-semibold text-red-700">

            {selected.length}
            {" "}
            soal dipilih

          </div>

          <button
            onClick={bulkDelete}
            className="bg-red-600 text-white px-5 py-3 rounded-2xl"
          >
            Delete Selected
          </button>

        </div>

      )}

      {/* LIST */}
      <div className="space-y-4">

        {filtered.map((q) => (

          <div
            key={q.id}
            className="bg-white rounded-3xl shadow-sm border p-6 hover:shadow-xl transition"
          >

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

              {/* LEFT */}
              <div className="flex gap-5 flex-1">

                <input
                  type="checkbox"
                  checked={
                    selected.includes(q.id)
                  }
                  onChange={() =>
                    toggleSelect(q.id)
                  }
                  className="mt-2"
                />

                <div className="flex-1">

                  <div className="text-lg font-semibold text-gray-800 leading-relaxed">

                    {q.question}

                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">

                    <Badge>
                      {q.category?.name}
                    </Badge>

                    <Badge color="blue">
                      {q.type}
                    </Badge>

                    <Badge color="green">
                      Score:
                      {" "}
                      {q.score || 0}
                    </Badge>

                  </div>

                </div>

              </div>

              {/* ACTION */}
              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setViewing(q)
                  }
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl hover:bg-green-200 transition"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    setEditing(q)
                  }
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl hover:bg-blue-200 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    remove(q.id)
                  }
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-2xl hover:bg-red-200 transition"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}

      {showCategoryModal && (

        <CreateCategoryModal
          courseId={id}
          onClose={() =>
            setShowCategoryModal(false)
          }
          onSuccess={load}
        />

      )}

      {showQuestionModal && (

        <CreateQuestionModal
          courseId={id}
          categories={categories}
          onClose={() =>
            setShowQuestionModal(false)
          }
          onSuccess={load}
        />

      )}

      {showImportModal && (

        <ImportQuestionModal
          courseId={id}
          categories={categories}
          onClose={() =>
            setShowImportModal(false)
          }
          onSuccess={load}
        />

      )}

      {viewing && (

        <ViewQuestionModal
          data={viewing}
          onClose={() =>
            setViewing(null)
          }
        />

      )}

      {editing && (

        <EditQuestionModal
          data={editing}
          categories={categories}
          onClose={() =>
            setEditing(null)
          }
          onSuccess={load}
        />

      )}

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
  title,
  value,
  color,
  icon
}) {

  const colors = {

    orange:
      "from-orange-500 to-red-500",

    pink:
      "from-pink-500 to-rose-500",

    purple:
      "from-purple-500 to-indigo-600"
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-lg transition">

      <div className="flex justify-between items-start">

        <div>

          <div className="text-gray-500 text-sm">
            {title}
          </div>

          <div className="text-4xl font-bold mt-3">
            {value}
          </div>

        </div>

        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${colors[color]} text-white flex items-center justify-center text-2xl shadow-lg`}>

          {icon}

        </div>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| BADGE
|--------------------------------------------------------------------------
*/

function Badge({
  children,
  color = "gray"
}) {

  const styles = {

    gray:
      "bg-gray-100 text-gray-700",

    blue:
      "bg-blue-100 text-blue-700",

    green:
      "bg-green-100 text-green-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[color]}`}>

      {children}

    </span>
  );
}