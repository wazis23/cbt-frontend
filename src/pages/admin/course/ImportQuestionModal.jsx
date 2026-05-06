import { useState } from "react";
import api from "../../../api/api";

export default function ImportQuestionModal({
  courseId,
  categories,
  onClose,
  onSuccess
}) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("mcq");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);

  // ================= PREVIEW =================
  const handlePreview = async () => {
    if (!file) return alert("Pilih file dulu");
    if (!categoryId) return alert("Pilih kategori");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    fd.append("course_id", courseId);
    fd.append("category_id", categoryId);

    try {
      setLoading(true);

      const res = await api.post("/admin/questions/preview", fd);

      setPreviewData(res.data.data);
      setErrors(res.data.errors || []);

    } catch (err) {
      console.error(err);
      alert("Preview gagal");
    } finally {
      setLoading(false);
    }
  };

  // ================= CONFIRM IMPORT =================
  const handleConfirmImport = async () => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    fd.append("course_id", courseId);
    fd.append("category_id", categoryId);

    try {
      setLoading(true);

      const res = await api.post("/admin/questions/import", fd);

      if (res.data.errors.length > 0) {
        alert("Import selesai, ada error");
      } else {
        alert("Import berhasil");
      }

      onSuccess();
      onClose();

    } catch (err) {
      alert("Import gagal");
    } finally {
      setLoading(false);
    }
  };

  // ================= DOWNLOAD =================
  const downloadTemplate = async () => {
    const res = await api.get(`/admin/questions/template?type=${type}`, {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `template-${type}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[800px] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-auto">

        <h3 className="text-lg font-semibold mb-4">
          Import Question
        </h3>

        {/* FILE */}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-3" />

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full mb-3"
        >
          <option value="mcq">MCQ</option>
          <option value="multiple">Multiple</option>
          <option value="true_false">True/False</option>
          <option value="short_answer">Short</option>
          <option value="essay">Essay</option>
        </select>

        {/* CATEGORY */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 w-full mb-3"
        >
          <option value="">Pilih kategori</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* TEMPLATE */}
        <button onClick={downloadTemplate} className="text-blue-500 underline mb-3">
          Download Template
        </button>

        {/* ACTION */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handlePreview}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Preview
          </button>

          {previewData.length > 0 && (
            <button
              onClick={handleConfirmImport}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirm Import
            </button>
          )}
        </div>

        {/* PREVIEW TABLE */}
        {previewData.length > 0 && (
          <div className="border rounded overflow-auto max-h-[300px]">

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Row</th>
                  <th className="p-2">Question</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {previewData.map((row, i) => (
                  <tr
                    key={i}
                    className={row.status === "error" ? "bg-red-100" : ""}
                  >
                    <td className="p-2">{row.row}</td>
                    <td className="p-2">{row.question}</td>
                    <td className="p-2">
                      {row.status === "error"
                        ? `❌ ${row.message}`
                        : "✅ OK"}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-400 px-4 py-2 text-white">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}