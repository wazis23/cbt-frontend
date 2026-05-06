import { useEffect, useState } from "react";
import api from "../../api/api";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function AssignUser() {

  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    course_id: "",
    user_id: "",
    role: "siswa"
  });

  useEffect(() => {
    api.get("/admin/list-courses").then(res => setCourses(res.data));
    api.get("/admin/list-users").then(res => setUsers(res.data));
  }, []);

  const assign = async () => {
    await api.post("/admin/course/assign", form);
    alert("Berhasil");
  };

  return (
    <div>
      <h2>Assign</h2>

      <select onChange={e => setForm({...form, course_id:e.target.value})}>
        <option>Pilih Course</option>
        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <br/><br/>

      <select onChange={e => setForm({...form, user_id:e.target.value})}>
        <option>Pilih User</option>
        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>

      <br/><br/>

      <select onChange={e => setForm({...form, role:e.target.value})}>
        <option value="siswa">Siswa</option>
        <option value="guru">Guru</option>
      </select>

      <br/><br/>

      <button onClick={assign}>Assign</button>
    </div>
  );
}