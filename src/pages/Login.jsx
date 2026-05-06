import { useState } from "react";
import api from "../api/api";
import { setToken } from "../utils/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { username, password });
      setToken(res.data.token);
      window.location.href = "/token";
    } catch {
      alert("Login gagal");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <br/><br/>
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <br/><br/>
      <button onClick={login}>Login</button>
    </div>
  );
}