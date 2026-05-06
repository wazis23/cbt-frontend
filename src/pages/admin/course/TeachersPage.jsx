import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";

export default function TeachersPage() {
  const { id } = useParams();

  const [teachers, setTeachers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [searchAssigned, setSearchAssigned] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, teachers]);

  // =============================
  // LOAD DATA
  // =============================

  const loadTeachers = async () => {
    const res = await api.get(`/admin/courses/${id}/users`);
    setTeachers(res.data.filter(u => u.pivot.role === "guru"));
  };

  const loadUsers = async () => {
    const res = await api.get(`/admin/users?search=${search}`);

    const assignedIds = teachers.map(t => t.id);

    setAllUsers(
      res.data
        .filter(u => u.role === "guru")
        .filter(u => !assignedIds.includes(u.id))
    );
  };

  // =============================
  // ASSIGN
  // =============================

  const toggleSelect = (user) => {
    setSelectedUsers(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  };

  const assign = async () => {
    await Promise.all(
      selectedUsers.map(u =>
        api.post(`/admin/courses/${id}/assign`, {
          user_id: u.id,
          role: "guru"
        })
      )
    );

    setSelectedUsers([]);
    setSearch("");
    loadTeachers();
  };

  // =============================
  // REMOVE
  // =============================

  const remove = async (userId) => {
    await api.post(`/admin/courses/${id}/remove`, {
      user_id: userId
    });

    loadTeachers();
  };

  const bulkRemove = async () => {
    await Promise.all(
      checkedUsers.map(u =>
        api.post(`/admin/courses/${id}/remove`, {
          user_id: u.id
        })
      )
    );

    setCheckedUsers([]);
    loadTeachers();
  };

  // =============================
  // CHECKBOX
  // =============================

  const toggleCheck = (user) => {
    setCheckedUsers(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  };

  const toggleAll = (data) => {
    const ids = data.map(u => u.id);

    const allSelected = ids.every(id =>
      checkedUsers.find(u => u.id === id)
    );

    if (allSelected) {
      setCheckedUsers(prev =>
        prev.filter(u => !ids.includes(u.id))
      );
    } else {
      const newUsers = data.filter(
        u => !checkedUsers.find(s => s.id === u.id)
      );
      setCheckedUsers(prev => [...prev, ...newUsers]);
    }
  };

  // =============================
  // FILTER + PAGINATION
  // =============================

  const filtered = teachers.filter(u =>
    u.name.toLowerCase().includes(searchAssigned.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchAssigned.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  // =============================
  // UI
  // =============================

  return (
    <div>

      <h2 className="text-2xl font-bold mb-6">Teachers</h2>

      {/* ASSIGN */}
      <div className="bg-white p-4 rounded shadow mb-6">

        <h3 className="font-semibold mb-3">Add Teacher</h3>

        <input
          placeholder="Cari guru (nama / email)"
          className="border p-2 rounded w-full mb-2"
          value={search}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => setSearch(e.target.value)}
        />

        {showDropdown && search && (
          <div className="border rounded bg-white max-h-40 overflow-auto mb-3 shadow">
            {allUsers.map(u => (
              <div
                key={u.id}
                onClick={() => toggleSelect(u)}
                className={`p-2 cursor-pointer flex justify-between ${
                  selectedUsers.find(s => s.id === u.id)
                    ? "bg-green-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>{u.name}</span>
                <span className="text-xs text-gray-500">
                  {u.email}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAG */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map(u => (
            <span
              key={u.id}
              className="bg-green-500 text-white px-2 py-1 rounded text-sm flex gap-2"
            >
              {u.name}
              <button onClick={() => toggleSelect(u)}>✕</button>
            </span>
          ))}
        </div>

        <button
          onClick={assign}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Assign Teacher
        </button>

      </div>

      {/* SEARCH */}
      <input
        placeholder="Cari guru di course..."
        className="border p-2 rounded w-full mb-3"
        value={searchAssigned}
        onChange={(e) => setSearchAssigned(e.target.value)}
      />

      {/* BULK */}
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
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
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

                  <td className="p-3">{u.email}</td>

                  <td className="p-3">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm">
                      Guru
                    </span>
                  </td>

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
                ? "bg-green-600 text-white"
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