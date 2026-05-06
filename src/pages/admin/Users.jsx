import { useEffect, useState } from "react";
import api from "../../api/api";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2>Users</h2>

      {users.map(u => (
        <div key={u.id}>{u.name} - {u.role}</div>
      ))}
    </div>
  );
}