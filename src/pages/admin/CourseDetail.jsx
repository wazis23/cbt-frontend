import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../api/api";

export default function CourseDetail() {

  const { id } = useParams();

  const [course, setCourse] = useState({});

  const [stats, setStats] = useState({});

  const [users, setUsers] = useState([]);

  useEffect(() => {

    load();

  }, []);

  const load = async () => {

    const c = await api.get(
      `/admin/courses/${id}`
    );

    const s = await api.get(
      `/admin/courses/${id}/dashboard`
    );

    const u = await api.get(
      `/admin/courses/${id}/users`
    );

    setCourse(c.data);

    setStats(s.data);

    setUsers(u.data);
  };

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="text-blue-100 text-sm mb-3">
              CBT Course Management
            </div>

            <h1 className="text-4xl font-bold">
              {course.name}
            </h1>

            <p className="text-blue-100 mt-4 max-w-2xl">
              Dashboard utama course untuk
              monitoring siswa,
              guru,
              question bank,
              dan exam CBT.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-6 min-w-[220px]">

            <div className="text-blue-100 text-sm">
              Course Status
            </div>

            <div className="text-3xl font-bold mt-2">
              Active
            </div>

            <div className="text-sm text-blue-100 mt-2">
              ID:
              {" "}
              {course.id}
            </div>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Students"
          value={stats.students || 0}
          color="blue"
          icon="🎓"
        />

        <StatCard
          title="Teachers"
          value={stats.teachers || 0}
          color="green"
          icon="👨‍🏫"
        />

        <StatCard
          title="Exams"
          value={stats.exams || 0}
          color="purple"
          icon="📝"
        />

        <StatCard
          title="Questions"
          value={stats.questions || 0}
          color="orange"
          icon="📚"
        />

      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* RECENT USERS */}
          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold">
                Recent Users
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Pengguna terbaru pada course ini
              </p>

            </div>

            <div className="divide-y">

              {users.slice(0, 8).map((u) => (

                <div
                  key={u.id}
                  className="p-5 flex items-center justify-between hover:bg-gray-50 transition"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">

                      {u.name?.charAt(0)}

                    </div>

                    <div>

                      <div className="font-semibold text-gray-800">

                        {u.name}

                      </div>

                      <div className="text-sm text-gray-500">

                        {u.email || u.username}

                      </div>

                    </div>

                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    u.pivot?.role === "guru"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>

                    {u.pivot?.role}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* COURSE INFO */}
          <div className="bg-white rounded-3xl shadow-sm border p-6">

            <h2 className="text-xl font-bold mb-5">
              Course Information
            </h2>

            <div className="space-y-4">

              <InfoItem
                label="Course ID"
                value={course.id}
              />

              <InfoItem
                label="Course Name"
                value={course.name}
              />

              <InfoItem
                label="Created"
                value={
                  course.created_at
                    ? new Date(
                        course.created_at
                      ).toLocaleDateString()
                    : "-"
                }
              />

            </div>

          </div>

          {/* QUICK STATS */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl">

            <div className="text-lg font-bold">
              CBT Analytics
            </div>

            <div className="mt-6 space-y-4">

              <MiniStat
                label="Total User"
                value={users.length}
              />

              <MiniStat
                label="Teacher Ratio"
                value={`${stats.teachers || 0}/${users.length || 0}`}
              />

              <MiniStat
                label="Question Ready"
                value={stats.questions || 0}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
  title,
  value,
  color,
  icon
}) {

  const colors = {
    blue:
      "from-blue-500 to-indigo-600",

    green:
      "from-green-500 to-emerald-600",

    purple:
      "from-purple-500 to-violet-600",

    orange:
      "from-orange-500 to-red-500"
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-lg transition">

      <div className="flex justify-between items-start">

        <div>

          <div className="text-gray-500 text-sm">
            {title}
          </div>

          <div className="text-4xl font-bold mt-3">
            {value}
          </div>

        </div>

        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${colors[color]} text-white flex items-center justify-center text-2xl shadow-lg`}>

          {icon}

        </div>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| INFO ITEM
|--------------------------------------------------------------------------
*/

function InfoItem({
  label,
  value
}) {

  return (
    <div>

      <div className="text-sm text-gray-500">
        {label}
      </div>

      <div className="font-semibold mt-1">
        {value || "-"}
      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| MINI STAT
|--------------------------------------------------------------------------
*/

function MiniStat({
  label,
  value
}) {

  return (
    <div className="flex justify-between items-center">

      <div className="text-indigo-100">
        {label}
      </div>

      <div className="font-bold text-xl">
        {value}
      </div>

    </div>
  );
}