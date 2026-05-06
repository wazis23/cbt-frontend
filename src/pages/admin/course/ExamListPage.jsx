import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../../../api/api";

import CreateExamModal from "./exams/CreateExamModal";

import {
  getRole
} from "../../../utils/auth";

export default function ExamListPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const role = getRole();

  const prefix =
    role === "admin"
      ? "/admin"
      : "/guru";

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);

  const [exams, setExams] = useState([]);

  const [openCreate, setOpenCreate] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD
  |--------------------------------------------------------------------------
  */

  const loadData = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        `${prefix}/courses/${id}/exams`
      );

      setExams(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadData();

  }, []);

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const removeExam = async (examId) => {

    const ok = confirm(
      "Hapus exam ini?"
    );

    if (!ok) return;

    try {

      await api.delete(
        `${prefix}/exams/${examId}`
      );

      loadData();

    } catch (err) {

      console.log(err);

      alert("Gagal menghapus exam");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  const getStatus = (exam) => {

    const now = new Date();

    const start =
      new Date(exam.start_time);

    const end =
      new Date(exam.end_time);

    if (!exam.is_active) {
      return {
        text: "Inactive",
        color:
          "bg-gray-100 text-gray-700"
      };
    }

    if (now < start) {
      return {
        text: "Upcoming",
        color:
          "bg-blue-100 text-blue-700"
      };
    }

    if (
      now >= start &&
      now <= end
    ) {
      return {
        text: "Running",
        color:
          "bg-green-100 text-green-700"
      };
    }

    return {
      text: "Finished",
      color:
        "bg-red-100 text-red-700"
    };
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-xl">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <div className="text-blue-100 text-sm mb-2">
              CBT Management
            </div>

            <h1 className="text-4xl font-bold">
              Exam Sessions
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              Kelola seluruh ujian CBT,
              jadwal ujian, scoring,
              random question,
              dan monitoring exam.
            </p>

          </div>

          <button
            onClick={() =>
              setOpenCreate(true)
            }
            className="bg-white text-blue-700 px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition shadow-lg"
          >
            + Create Exam
          </button>

        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5">

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="text-gray-500 text-sm">
            Total Exam
          </div>

          <div className="text-3xl font-bold mt-2">
            {exams.length}
          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="text-gray-500 text-sm">
            Running
          </div>

          <div className="text-3xl font-bold mt-2 text-green-600">

            {
              exams.filter(
                x =>
                  getStatus(x).text
                  === "Running"
              ).length
            }

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="text-gray-500 text-sm">
            Upcoming
          </div>

          <div className="text-3xl font-bold mt-2 text-blue-600">

            {
              exams.filter(
                x =>
                  getStatus(x).text
                  === "Upcoming"
              ).length
            }

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="text-gray-500 text-sm">
            Finished
          </div>

          <div className="text-3xl font-bold mt-2 text-red-600">

            {
              exams.filter(
                x =>
                  getStatus(x).text
                  === "Finished"
              ).length
            }

          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

        <div className="p-6 border-b flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold">
              Exam List
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Semua ujian pada course ini
            </p>

          </div>

        </div>

        {loading ? (

          <div className="p-10 text-center text-gray-500">
            Loading...
          </div>

        ) : exams.length === 0 ? (

          <div className="p-16 text-center">

            <div className="text-6xl mb-4">
              📝
            </div>

            <div className="text-2xl font-bold text-gray-700">
              Belum ada exam
            </div>

            <p className="text-gray-500 mt-3">
              Buat exam pertama untuk course ini
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr className="text-left text-sm text-gray-600">

                  <th className="px-6 py-4">
                    Exam
                  </th>

                  <th className="px-6 py-4">
                    Type
                  </th>

                  <th className="px-6 py-4">
                    Duration
                  </th>

                  <th className="px-6 py-4">
                    Scoring
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Schedule
                  </th>

                  <th className="px-6 py-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {exams.map((exam) => {

                  const status =
                    getStatus(exam);

                  return (

                    <tr
                      key={exam.id}
                      className="border-t hover:bg-gray-50 transition"
                    >

                      {/* TITLE */}
                      <td className="px-6 py-5">

                        <div className="font-semibold text-gray-800">

                          {exam.title}

                        </div>

                        <div className="text-sm text-gray-500 mt-1">

                          Max Attempt:
                          {" "}
                          {exam.max_attempt}

                        </div>

                      </td>

                      {/* TYPE */}
                      <td className="px-6 py-5">

                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          exam.type === "official"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>

                          {exam.type}

                        </span>

                      </td>

                      {/* DURATION */}
                      <td className="px-6 py-5">

                        {exam.duration} min

                      </td>

                      {/* SCORING */}
                      <td className="px-6 py-5">

                        <div className="text-sm font-medium">

                          {exam.scoring_mode}

                        </div>

                        <div className="text-xs text-gray-500 mt-1">

                          Max:
                          {" "}
                          {exam.max_score}

                        </div>

                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">

                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>

                          {status.text}

                        </span>

                      </td>

                      {/* SCHEDULE */}
                      <td className="px-6 py-5 text-sm">

                        <div>

                          {new Date(
                            exam.start_time
                          ).toLocaleString()}

                        </div>

                        <div className="text-gray-500 mt-1">

                          →
                          {" "}
                          {new Date(
                            exam.end_time
                          ).toLocaleString()}

                        </div>

                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `${prefix}/courses/${id}/exams/${exam.id}`
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                          >
                            Open
                          </button>

                          <button
                            onClick={() =>
                              removeExam(exam.id)
                            }
                            className="px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* MODAL */}
      {openCreate && (

        <CreateExamModal
          courseId={id}
          onClose={() =>
            setOpenCreate(false)
          }
          onSuccess={loadData}
        />

      )}

    </div>
  );
}