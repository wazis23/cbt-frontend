import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    class: "",
    description: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/admin/courses");
    setCourses(res.data);
  };

  const submit = async () => {
    if (!form.name || !form.code || !form.class) {
      alert("Nama, Code, dan Class wajib diisi");
      return;
    }

    try {
      await api.post("/admin/courses", form);

      setShowModal(false);
      setForm({
        name: "",
        code: "",
        class: "",
        description: ""
      });

      load();
    } catch (err) {
      console.error(err);
      alert("Gagal membuat course");
    }
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Courses</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Course
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-3 gap-5">
        {courses.map(c => (
          <div
            key={c.id}
            className="bg-white rounded shadow p-5 hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/admin/courses/${c.id}`)}
          >
            <h3 className="font-bold text-lg">{c.name}</h3>

            <div className="mt-2 text-sm text-gray-500">
              Code: {c.code}
            </div>

            <div className="text-sm text-gray-500">
              Class: {c.class}
            </div>

            <div className="mt-3 text-sm text-gray-400">
              {c.description || "-"}
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <span className={c.is_active ? "text-green-500" : "text-red-500"}>
                {c.is_active ? "Active" : "Hidden"}
              </span>

              <span className="text-blue-500">
                Manage →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-[400px]">

            <h3 className="text-lg font-bold mb-4">Create Course</h3>

            {/* NAME */}
            <input
              placeholder="Nama Course"
              className="w-full border p-2 mb-3 rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {/* CODE */}
            <input
              placeholder="Course Code (contoh: MTK-10)"
              className="w-full border p-2 mb-3 rounded"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
            />

            {/* CLASS */}
            <input
              placeholder="Class (X / XI / XII / SMP)"
              className="w-full border p-2 mb-3 rounded"
              value={form.class}
              onChange={(e) =>
                setForm({ ...form, class: e.target.value })
              }
            />

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              className="w-full border p-2 mb-4 rounded"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            {/* ACTION */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={submit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}