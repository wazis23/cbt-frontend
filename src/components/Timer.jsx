import { useEffect, useState } from "react";
import api from "../api/api";

export default function Timer({ attemptId }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const i = setInterval(async () => {
      const res = await api.get(`/exam/timer/${attemptId}`);
      if (res.data.status === "expired") {
        alert("Waktu habis");
        window.location.href = "/";
      }
      setTime(res.data.remaining_seconds);
    }, 1000);

    return () => clearInterval(i);
  }, []);

  return <h3>⏱ {time} detik</h3>;
}