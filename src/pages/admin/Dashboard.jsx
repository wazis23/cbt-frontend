import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Dashboard() {

  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    exams: 0
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const users = await api.get("/admin/users");
    const courses = await api.get("/admin/list-courses");
    const exams = await api.get("/admin/exams");

    setStats({
      users: users.data.length,
      courses: courses.data.length,
      exams: exams.data.length
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-3 gap-5">
        <Card title="Users" value={stats.users} />
        <Card title="Courses" value={stats.courses} />
        <Card title="Exams" value={stats.exams} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}