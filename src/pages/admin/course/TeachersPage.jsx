import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../../api/api";

export default function TeachersPage() {

  const { id } = useParams();

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [teachers, setTeachers] = useState([]);

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

    loadTeachers();

  }, []);

  useEffect(() => {

    const delay = setTimeout(() => {

      loadUsers();

    }, 300);

    return () => clearTimeout(delay);

  }, [search, teachers]);

  const loadTeachers = async () => {

    const res = await api.get(
      `/admin/courses/${id}/users`
    );

    setTeachers(
      res.data.filter(
        u => u.pivot.role === "guru"
      )
    );
  };

  const loadUsers = async () => {

    const res = await api.get(
      `/admin/users?search=${search}`
    );

    const assignedIds =
      teachers.map(t => t.id);

    setAllUsers(

      res.data
        .filter(
          u => u.role === "guru"
        )
        .filter(
          u =>
            !assignedIds.includes(u.id)
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT
  |--------------------------------------------------------------------------
  */

  const toggleSelect = (user) => {

    setSelectedUsers(prev =>

      prev.find(
        u => u.id === user.id
      )

        ? prev.filter(
            u => u.id !== user.id
          )

        : [...prev, user]
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ASSIGN
  |--------------------------------------------------------------------------
  */

  const assign = async () => {

    await Promise.all(

      selectedUsers.map(u =>

        api.post(
          `/admin/courses/${id}/assign`,
          {
            user_id: u.id,
            role: "guru"
          }
        )
      )
    );

    setSelectedUsers([]);

    setSearch("");

    loadTeachers();
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

    loadTeachers();
  };

  /*
  |--------------------------------------------------------------------------
  | BULK REMOVE
  |--------------------------------------------------------------------------
  */

  const bulkRemove = async () => {

    await Promise.all(

      checkedUsers.map(u =>

        api.post(
          `/admin/courses/${id}/remove`,
          {
            user_id: u.id
          }
        )
      )
    );

    setCheckedUsers([]);

    loadTeachers();
  };

  /*
  |--------------------------------------------------------------------------
  | CHECKBOX
  |--------------------------------------------------------------------------
  */

  const toggleCheck = (user) => {

    setCheckedUsers(prev =>

      prev.find(
        u => u.id === user.id
      )

        ? prev.filter(
            u => u.id !== user.id
          )

        : [...prev, user]
    );
  };

  const toggleAll = (data) => {

    const ids = data.map(
      u => u.id
    );

    const allSelected =
      ids.every(id =>

        checkedUsers.find(
          u => u.id === id
        )
      );

    if (allSelected) {

      setCheckedUsers(prev =>

        prev.filter(
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

      setCheckedUsers(prev => [
        ...prev,
        ...newUsers
      ]);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filtered =
    teachers.filter(u =>

      u.name
        .toLowerCase()
        .includes(
          searchAssigned.toLowerCase()
        )

      ||

      (u.email || "")
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
    filtered.slice(
      (page - 1) * perPage,
      page * perPage
    );

  const totalPages =
    Math.ceil(
      filtered.length / perPage
    );

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="text-green-100 text-sm mb-2">
              Teacher Management
            </div>

            <h1 className="text-4xl font-bold">
              Teachers
            </h1>

            <p className="text-green-100 mt-3 max-w-2xl">
              Kelola guru pengajar
              dan akses teacher CBT.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl px-8 py-6">

            <div className="text-green-100 text-sm">
              Total Teachers
            </div>

            <div className="text-5xl font-bold mt-2">
              {teachers.length}
            </div>

          </div>

        </div>

      </div>

      {/* ASSIGN */}
      <div className="bg-white rounded-3xl shadow-sm border p-6">

        <div className="mb-5">

          <h2 className="text-xl font-bold">
            Add Teacher
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Tambahkan guru ke course
          </p>

        </div>

        <input
          placeholder="Cari guru..."
          className="w-full border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition p-4 rounded-2xl outline-none"
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
                    ? "bg-green-100"
                    : "bg-white hover:bg-gray-50"
                }`}
              >

                <div>

                  <div className="font-semibold">
                    {u.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {u.email}
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
              className="bg-green-600 text-white px-4 py-2 rounded-2xl flex items-center gap-3"
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
          className="mt-5 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition"
        >
          Assign Teacher
        </button>

      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-3xl shadow-sm border p-5">

        <input
          placeholder="Cari guru..."
          className="w-full border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition p-4 rounded-2xl outline-none"
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
            guru dipilih

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
                  Teacher
                </th>

                <th className="p-5">
                  Email
                </th>

                <th className="p-5">
                  Role
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

                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 text-white flex items-center justify-center font-bold">

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

                      {u.email}

                    </td>

                    <td className="p-5">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                        Guru

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
                ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg"
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