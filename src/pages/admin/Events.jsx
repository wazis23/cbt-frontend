import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Events() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/admin/events");
    setEvents(res.data);
  };

  return (
    <div>

      <h2 className="text-2xl font-bold mb-6">Event Logs</h2>

      <div className="bg-white shadow rounded">

        {events.map(e => (
          <div key={e.id} className="p-4 border-b">

            <p className="font-semibold">{e.student?.name}</p>

            <p className="text-sm text-gray-600">{e.type}</p>

            <p className="text-xs text-gray-400">{e.created_at}</p>

          </div>
        ))}

      </div>

    </div>
  );
}