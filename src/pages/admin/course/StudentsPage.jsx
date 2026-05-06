import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";

export default function StudentsPage() {
  const { id } = useParams();

  const [students, setStudents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [searchAssigned, setSearchAssigned] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, students]);

  // 🔥 LOAD STUDENTS
  const loadStudents = async () => {
    const res = await api.get(`/admin/courses/${id}/users`);
    const siswa = res.data.filter(u => u.pivot.role === "siswa");
    setStudents(siswa);
  };

  // 🔥 SEARCH USERS (autocomplete)
  const loadUsers = async () => {
    const res = await api.get(`/admin/users?search=${search}`);

    const assignedIds = students.map(s => s.id);

    const filtered = res.data
      .filter(u => u.role === "siswa")
      .filter(u => !assignedIds.includes(u.id));

    setAllUsers(filtered);
  };

  // 🔥 SELECT MULTI (dropdown)
  const toggleSelect = (user) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // 🔥 ASSIGN MULTI
  const assign = async () => {
    for (let u of selectedUsers) {
      await api.post(`/admin/courses/${id}/assign`, {
        user_id: u.id,
        role: "siswa"
      });
    }

    setSelectedUsers([]);
    setSearch("");
    loadStudents();
  };

  // 🔥 REMOVE SINGLE
  const remove = async (userId) => {
    await api.post(`/admin/courses/${id}/remove`, {
      user_id: userId
    });

    loadStudents();
  };

  // 🔥 CHECKBOX TOGGLE
  const toggleCheck = (user) => {
    if (checkedUsers.find(u => u.id === user.id)) {
      setCheckedUsers(checkedUsers.filter(u => u.id !== user.id));
    } else {
      setCheckedUsers([...checkedUsers, user]);
    }
  };

  // 🔥 SELECT ALL (per page)
  const toggleAll = (data) => {
    const ids = data.map(u => u.id);

    const allSelected = ids.every(id =>
      checkedUsers.find(u => u.id === id)
    );

    if (allSelected) {
      setCheckedUsers(
        checkedUsers.filter(u => !ids.includes(u.id))
      );
    } else {
      const newUsers = data.filter(
        u => !checkedUsers.find(s => s.id === u.id)
      );
      setCheckedUsers([...checkedUsers, ...newUsers]);
    }
  };

  // 🔥 BULK REMOVE
  const bulkRemove = async () => {
    for (let u of checkedUsers) {
      await api.post(`/admin/courses/${id}/remove`, {
        user_id: u.id
      });
    }

    setCheckedUsers([]);
    loadStudents();
  };

  // 🔥 SEARCH ASSIGNED (table)
  const filteredStudents = students.filter(u =>
    u.name.toLowerCase().includes(searchAssigned.toLowerCase()) ||
    (u.class || "").toLowerCase().includes(searchAssigned.toLowerCase())
  );

  // 🔥 PAGINATION
  const paginated = filteredStudents.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalPages = Math.ceil(filteredStudents.length / perPage);

  return (
    <div>

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-6">Students</h2>

      {/* ASSIGN BOX */}
      <div className="bg-white p-4 rounded shadow mb-6">

        <h3 className="font-semibold mb-3">Add Student</h3>

        <input
          placeholder="Cari siswa (NIS / nama / kelas)"
          className="border p-2 rounded w-full mb-2"
          value={search}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => setSearch(e.target.value)}
        />

        {showDropdown && search && (
          <div className="border rounded bg-white max-h-40 overflow-auto mb-3 shadow">

            {allUsers.length === 0 && (
              <div className="p-2 text-gray-400">Tidak ditemukan</div>
            )}

            {allUsers.map(u => (
              <div
                key={u.id}
                onClick={() => toggleSelect(u)}
                className={`p-2 cursor-pointer flex justify-between ${
                  selectedUsers.find(s => s.id === u.id)
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>{u.name}</span>
                <span className="text-xs text-gray-500">
                  {u.class}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map(u => (
            <span
              key={u.id}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm flex items-center gap-2"
            >
              {u.name}
              <button onClick={() => toggleSelect(u)}>✕</button>
            </span>
          ))}
        </div>

        <button
          onClick={assign}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Assign Selected
        </button>

      </div>

      {/* SEARCH ASSIGNED */}
      <input
        placeholder="Cari siswa di course..."
        className="border p-2 rounded w-full mb-3"
        value={searchAssigned}
        onChange={(e) => setSearchAssigned(e.target.value)}
      />

      {/* BULK ACTION */}
      {checkedUsers.length > 0 && (
        <div className="mb-3 bg-yellow-100 p-3 rounded flex justify-between">
          <span>{checkedUsers.length} selected</span>
          <button
            onClick={bulkRemove}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove Selected
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded shadow">
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={() => toggleAll(paginated)}
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(u => {
              const checked = checkedUsers.find(s => s.id === u.id);

              return (
                <tr key={u.id} className="border-t">

                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={!!checked}
                      onChange={() => toggleCheck(u)}
                    />
                  </td>

                  <td className="p-3">{u.name}</td>

                  <td className="p-3">
                    <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                      {u.class || "-"}
                    </span>
                  </td>

                  <td className="p-3 text-green-500">Active</td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => remove(u.id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              page === p
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

    </div>
  );
}