import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../../api/api";

export default function StudentsPage() {

  const { id } = useParams();

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [students, setStudents] = useState([]);

  const [allUsers, setAllUsers] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [checkedUsers, setCheckedUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [searchAssigned, setSearchAssigned] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);

  const [page, setPage] = useState(1);

  const perPage = 8;

  /*
  |--------------------------------------------------------------------------
  | LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadStudents();

  }, []);

  useEffect(() => {

    const delay = setTimeout(() => {

      loadUsers();

    }, 300);

    return () => clearTimeout(delay);

  }, [search, students]);

  const loadStudents = async () => {

    const res = await api.get(
      `/admin/courses/${id}/users`
    );

    const siswa = res.data.filter(
      u => u.pivot.role === "siswa"
    );

    setStudents(siswa);
  };

  const loadUsers = async () => {

    const res = await api.get(
      `/admin/users?search=${search}`
    );

    const assignedIds =
      students.map(s => s.id);

    const filtered = res.data
      .filter(u => u.role === "siswa")
      .filter(
        u => !assignedIds.includes(u.id)
      );

    setAllUsers(filtered);
  };

  /*
  |--------------------------------------------------------------------------
  | ASSIGN
  |--------------------------------------------------------------------------
  */

  const toggleSelect = (user) => {

    if (
      selectedUsers.find(
        u => u.id === user.id
      )
    ) {

      setSelectedUsers(
        selectedUsers.filter(
          u => u.id !== user.id
        )
      );

    } else {

      setSelectedUsers([
        ...selectedUsers,
        user
      ]);
    }
  };

  const assign = async () => {

    for (let u of selectedUsers) {

      await api.post(
        `/admin/courses/${id}/assign`,
        {
          user_id: u.id,
          role: "siswa"
        }
      );
    }

    setSelectedUsers([]);

    setSearch("");

    loadStudents();
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE
  |--------------------------------------------------------------------------
  */

  const remove = async (userId) => {

    await api.post(
      `/admin/courses/${id}/remove`,
      {
        user_id: userId
      }
    );

    loadStudents();
  };

  /*
  |--------------------------------------------------------------------------
  | CHECKBOX
  |--------------------------------------------------------------------------
  */

  const toggleCheck = (user) => {

    if (
      checkedUsers.find(
        u => u.id === user.id
      )
    ) {

      setCheckedUsers(
        checkedUsers.filter(
          u => u.id !== user.id
        )
      );

    } else {

      setCheckedUsers([
        ...checkedUsers,
        user
      ]);
    }
  };

  const toggleAll = (data) => {

    const ids = data.map(u => u.id);

    const allSelected = ids.every(id =>
      checkedUsers.find(
        u => u.id === id
      )
    );

    if (allSelected) {

      setCheckedUsers(
        checkedUsers.filter(
          u => !ids.includes(u.id)
        )
      );

    } else {

      const newUsers = data.filter(
        u =>
          !checkedUsers.find(
            s => s.id === u.id
          )
      );

      setCheckedUsers([
        ...checkedUsers,
        ...newUsers
      ]);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | BULK REMOVE
  |--------------------------------------------------------------------------
  */

  const bulkRemove = async () => {

    for (let u of checkedUsers) {

      await api.post(
        `/admin/courses/${id}/remove`,
        {
          user_id: u.id
        }
      );
    }

    setCheckedUsers([]);

    loadStudents();
  };

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredStudents =
    students.filter(u =>

      u.name
        .toLowerCase()
        .includes(
          searchAssigned.toLowerCase()
        )

      ||

      (u.class || "")
        .toLowerCase()
        .includes(
          searchAssigned.toLowerCase()
        )
    );

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const paginated =
    filteredStudents.slice(
      (page - 1) * perPage,
      page * perPage
    );

  const totalPages =
    Math.ceil(
      filteredStudents.length / perPage
    );

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="text-blue-100 text-sm mb-2">
              Course Student Management
            </div>

            <h1 className="text-4xl font-bold">
              Students
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              Kelola seluruh siswa
              pada course CBT ini.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl px-8 py-6">

            <div className="text-blue-100 text-sm">
              Total Students
            </div>

            <div className="text-5xl font-bold mt-2">
              {students.length}
            </div>

          </div>

        </div>

      </div>

      {/* ASSIGN */}
      <div className="bg-white rounded-3xl shadow-sm border p-6">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-xl font-bold">
              Add Student
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Tambahkan siswa ke course
            </p>

          </div>

        </div>

        <input
          placeholder="Cari siswa..."
          className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition p-4 rounded-2xl outline-none"
          value={search}
          onFocus={() =>
            setShowDropdown(true)
          }
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* DROPDOWN */}
        {showDropdown && search && (

          <div className="mt-3 border rounded-2xl overflow-hidden shadow-lg">

            {allUsers.length === 0 && (

              <div className="p-4 text-gray-400 bg-white">
                Tidak ditemukan
              </div>

            )}

            {allUsers.map((u) => (

              <div
                key={u.id}
                onClick={() =>
                  toggleSelect(u)
                }
                className={`p-4 cursor-pointer flex justify-between transition ${
                  selectedUsers.find(
                    s => s.id === u.id
                  )
                    ? "bg-blue-100"
                    : "bg-white hover:bg-gray-50"
                }`}
              >

                <div>

                  <div className="font-semibold">
                    {u.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {u.class || "-"}
                  </div>

                </div>

                <div className="text-sm text-gray-400">
                  {u.username}
                </div>

              </div>

            ))}

          </div>

        )}

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-4">

          {selectedUsers.map((u) => (

            <div
              key={u.id}
              className="bg-blue-600 text-white px-4 py-2 rounded-2xl flex items-center gap-3"
            >

              {u.name}

              <button
                onClick={() =>
                  toggleSelect(u)
                }
              >
                ✕
              </button>

            </div>

          ))}

        </div>

        <button
          onClick={assign}
          className="mt-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition"
        >
          Assign Student
        </button>

      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-3xl shadow-sm border p-5">

        <input
          placeholder="Cari siswa di course..."
          className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition p-4 rounded-2xl outline-none"
          value={searchAssigned}
          onChange={(e) =>
            setSearchAssigned(
              e.target.value
            )
          }
        />

      </div>

      {/* BULK */}
      {checkedUsers.length > 0 && (

        <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-5 flex justify-between items-center">

          <div className="font-semibold text-yellow-700">

            {checkedUsers.length}
            {" "}
            siswa dipilih

          </div>

          <button
            onClick={bulkRemove}
            className="bg-red-600 text-white px-5 py-3 rounded-2xl"
          >
            Remove Selected
          </button>

        </div>

      )}

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="text-left text-gray-600 text-sm">

                <th className="p-5">

                  <input
                    type="checkbox"
                    onChange={() =>
                      toggleAll(
                        paginated
                      )
                    }
                  />

                </th>

                <th className="p-5">
                  Student
                </th>

                <th className="p-5">
                  Class
                </th>

                <th className="p-5">
                  Status
                </th>

                <th className="p-5 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {paginated.map((u) => {

                const checked =
                  checkedUsers.find(
                    s => s.id === u.id
                  );

                return (

                  <tr
                    key={u.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-5">

                      <input
                        type="checkbox"
                        checked={!!checked}
                        onChange={() =>
                          toggleCheck(u)
                        }
                      />

                    </td>

                    <td className="p-5">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold">

                          {u.name?.charAt(0)}

                        </div>

                        <div>

                          <div className="font-semibold">

                            {u.name}

                          </div>

                          <div className="text-sm text-gray-500">

                            {u.username}

                          </div>

                        </div>

                      </div>

                    </td>

                    <td className="p-5">

                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">

                        {u.class || "-"}

                      </span>

                    </td>

                    <td className="p-5">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                        Active

                      </span>

                    </td>

                    <td className="p-5 text-right">

                      <button
                        onClick={() =>
                          remove(u.id)
                        }
                        className="text-red-500 hover:text-red-700 font-semibold"
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

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3">

        {Array.from(
          {
            length: totalPages
          },
          (_, i) => i + 1
        ).map((p) => (

          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-11 h-11 rounded-2xl font-semibold transition ${
              page === p
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                : "bg-white border hover:bg-gray-50"
            }`}
          >

            {p}

          </button>

        ))}

      </div>

    </div>
  );
}