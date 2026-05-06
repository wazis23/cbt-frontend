import { useState } from "react";
import api from "../../../api/api";

export default function CreateCategoryModal({ courseId, onClose, onSuccess }) {
  const [name, setName] = useState("");

  const save = async () => {
    await api.post(`/admin/courses/${courseId}/categories`, {
        name
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-[400px]">
        <h3 className="font-bold mb-4">Create Category</h3>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={save} className="bg-green-600 text-white px-4 py-2 mr-2">
          Save
        </button>

        <button onClick={onClose} className="bg-gray-400 px-4 py-2">
          Cancel
        </button>
      </div>

    </div>
  );
}