import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

export default function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState({});
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("siswa");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const c = await api.get(`/admin/courses/${id}`);
    const s = await api.get(`/admin/courses/${id}/dashboard`);
    const u = await api.get(`/admin/courses/${id}/users`);
    const all = await api.get(`/admin/users`);

    setCourse(c.data);
    setStats(s.data);
    setUsers(u.data);
    setAllUsers(all.data);
  };

  const assign = async () => {
    if (!selectedUser) return;

    await api.post(`/admin/courses/${id}/assign`, {
      user_id: selectedUser,
      role
    });

    load();
  };

  const remove = async (userId) => {
    await api.post(`/admin/courses/${id}/remove`, {
      user_id: userId
    });

    load();
  };

  return (
    <div>

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-4">{course.name}</h2>

      {/* DASHBOARD */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Students" value={stats.students} />
        <Card title="Teachers" value={stats.teachers} />
        <Card title="Exams" value={stats.exams} />
        <Card title="Questions" value={stats.questions} />
      </div>

      {/* ASSIGN */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-3">Assign User</h3>

        <div className="flex gap-2">
          <select
            className="border p-2"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Pilih User</option>
            {allUsers.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
          </select>

          <button
            onClick={assign}
            className="bg-blue-600 text-white px-3"
          >
            Assign
          </button>
        </div>
      </div>

      {/* USER LIST */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-3">User in Course</h3>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th>Name</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b">
                <td>{u.name}</td>
                <td>{u.pivot.role}</td>
                <td>
                  <button
                    onClick={() => remove(u.id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold">{value || 0}</h3>
    </div>
  );
}