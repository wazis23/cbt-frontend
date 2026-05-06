import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function RunningExams() {

  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/admin/running-exams");
    setExams(res.data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Running Exams</h2>

      <div className="bg-white rounded shadow">

        {exams.map(e => (
          <div
            key={e.id}
            onClick={() => navigate(`/admin/monitor/${e.id}`)}
            className="p-4 border-b flex justify-between cursor-pointer hover:bg-gray-50"
          >
            <div>
              <p className="font-bold">{e.title}</p>
              <p className="text-sm text-gray-500">{e.course?.name}</p>
            </div>

            <span className="text-green-600 font-semibold">
              Running
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}