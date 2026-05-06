import { useState } from "react";
import api from "../api/api";

export default function Token() {
  const [token, setToken] = useState("");

  const verify = async () => {
    try {
      const res = await api.post("/token/verify", { token });
      localStorage.setItem("exam_session_id", res.data.exam_session_id);
      window.location.href = "/exam";
    } catch {
      alert("Token tidak valid");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Masukkan Token</h2>
      <input onChange={e => setToken(e.target.value)} />
      <button onClick={verify}>Masuk</button>
    </div>
  );
}