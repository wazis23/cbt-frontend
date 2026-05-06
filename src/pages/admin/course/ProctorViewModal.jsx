import { useEffect, useState } from "react";
import api from "../../../api/api";

export default function ProctorViewModal({ exam, onClose }) {

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 load rooms dari backend (kalau belum ada, bisa fallback dummy)
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const res = await api.get(`/admin/rooms?course_id=${exam.course_id}`);
      setRooms(res.data);
    } catch {
      // fallback sementara
      setRooms([
        { id: 1, name: "Lab 1" },
        { id: 2, name: "Lab 2" },
        { id: 3, name: "Ruang A" }
      ]);
    }
  };

  const generateToken = async () => {
    if (!selectedRoom) return alert("Pilih ruangan");

    try {
      setLoading(true);

      const res = await api.post("/proctor/token/generate", {
        room_id: selectedRoom,
        exam_session_id: exam.id
      });

      setTokenData(res.data);

    } catch (err) {
      alert(err.response?.data?.error || "Gagal generate token");
    } finally {
      setLoading(false);
    }
  };

  const openMonitoring = () => {
    window.open(`/proctor/monitor/${exam.id}`, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white w-[520px] rounded-xl shadow-lg p-6">

        <h3 className="text-lg font-semibold mb-4">
          Proctor View
        </h3>

        {/* INFO EXAM */}
        <div className="mb-4 text-sm text-gray-600">
          <div><b>Exam:</b> {exam.title}</div>
          <div><b>Type:</b> {exam.type}</div>
        </div>

        {/* SELECT ROOM */}
        <div className="mb-4">
          <label className="text-sm">Pilih Ruangan</label>

          <select
            className="border p-2 w-full mt-1"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="">-- pilih ruangan --</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* TOKEN */}
        {tokenData && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-center">
            <div className="text-xs text-gray-500">TOKEN</div>
            <div className="text-2xl font-bold tracking-widest">
              {tokenData.token}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Exp: {tokenData.expired_at}
            </div>
          </div>
        )}

        {/* ACTION */}
        <div className="flex justify-between gap-2">

          <button
            onClick={generateToken}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Generating..." : "Generate Token"}
          </button>

          <button
            onClick={openMonitoring}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Monitor
          </button>

        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="text-gray-500">
            Close
          </button>
        </div>

      </div>

    </div>
  );
}