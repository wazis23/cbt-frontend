import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../../../api/api";

import {
  getRole
} from "../../../utils/auth";

import ExamRuleBuilder from "./exams/ExamRuleBuilder";

export default function ExamDetailPage() {

  const {
    id,
    examId
  } = useParams();

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

  const [exam, setExam] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD
  |--------------------------------------------------------------------------
  */

  const loadData = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        `${prefix}/exams/${examId}`
      );

      setExam(res.data);

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
  | STATUS
  |--------------------------------------------------------------------------
  */

  const getStatus = () => {

    if (!exam) return null;

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

  if (loading) {

    return (
      <div className="bg-white rounded-3xl p-10 shadow text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!exam) {

    return (
      <div className="bg-white rounded-3xl p-10 shadow text-center text-red-500">
        Exam tidak ditemukan
      </div>
    );
  }

  const status = getStatus();

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="flex items-center gap-3 mb-4">

              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${status.color}`}>

                {status.text}

              </span>

              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                exam.type === "official"
                  ? "bg-red-500/20 text-red-100"
                  : "bg-yellow-500/20 text-yellow-100"
              }`}>

                {exam.type}

              </span>

            </div>

            <h1 className="text-4xl font-bold">
              {exam.title}
            </h1>

            <p className="text-blue-100 mt-3 max-w-3xl">
              Kelola rule generator,
              proktor,
              monitoring,
              dan sistem CBT untuk exam ini.
            </p>

          </div>

          {/* ACTION */}
          <div className="flex flex-wrap gap-3">

            {/* MONITOR */}
            <button
              onClick={() =>
                navigate(
                  role === "admin"
                    ? `/admin/monitor/${exam.id}`
                    : `/proctor/monitor/${exam.id}`
                )
              }
              className="bg-white text-blue-700 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
            >
              Monitoring
            </button>

            {/* BACK */}
            <button
              onClick={() =>
                navigate(-1)
              }
              className="bg-white/10 border border-white/20 px-5 py-3 rounded-2xl font-semibold hover:bg-white/20 transition"
            >
              Back
            </button>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5">

        {/* DURATION */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="text-gray-500 text-sm">
            Duration
          </div>

          <div className="text-3xl font-bold mt-2">
            {exam.duration}
          </div>

          <div className="text-sm text-gray-400 mt-1">
            Minutes
          </div>

        </div>

        {/* MAX SCORE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="text-gray-500 text-sm">
            Maximum Score
          </div>

          <div className="text-3xl font-bold mt-2">
            {exam.max_score}
          </div>

          <div className="text-sm text-gray-400 mt-1">
            {exam.scoring_mode}
          </div>

        </div>

        {/* ATTEMPT */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="text-gray-500 text-sm">
            Max Attempt
          </div>

          <div className="text-3xl font-bold mt-2">
            {exam.max_attempt}
          </div>

          <div className="text-sm text-gray-400 mt-1">
            attempt
          </div>

        </div>

        {/* RULES */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="text-gray-500 text-sm">
            Total Rules
          </div>

          <div className="text-3xl font-bold mt-2">
            {exam.rules?.length || 0}
          </div>

          <div className="text-sm text-gray-400 mt-1">
            question generator
          </div>

        </div>

      </div>

      {/* INFO */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* SCHEDULE */}
        <div className="bg-white rounded-3xl shadow-sm border p-6">

          <h2 className="text-xl font-bold mb-5">
            Schedule
          </h2>

          <div className="space-y-5">

            <div>

              <div className="text-sm text-gray-500">
                Start Time
              </div>

              <div className="font-semibold mt-1">
                {new Date(
                  exam.start_time
                ).toLocaleString()}
              </div>

            </div>

            <div>

              <div className="text-sm text-gray-500">
                End Time
              </div>

              <div className="font-semibold mt-1">
                {new Date(
                  exam.end_time
                ).toLocaleString()}
              </div>

            </div>

          </div>

        </div>

        {/* SCORING */}
        <div className="bg-white rounded-3xl shadow-sm border p-6">

          <h2 className="text-xl font-bold mb-5">
            Scoring System
          </h2>

          <div className={`rounded-3xl p-6 ${
            exam.scoring_mode === "auto"
              ? "bg-blue-50"
              : "bg-orange-50"
          }`}>

            <div className={`text-lg font-bold ${
              exam.scoring_mode === "auto"
                ? "text-blue-700"
                : "text-orange-700"
            }`}>

              {exam.scoring_mode}

            </div>

            <p className="mt-3 text-sm text-gray-600 leading-relaxed">

              {exam.scoring_mode === "auto"
                ? "Nilai akan dibagi rata otomatis berdasarkan jumlah soal yang di-generate."
                : "Nilai mengikuti score masing-masing soal pada question bank."}

            </p>

          </div>

        </div>

      </div>

      {/* RULE BUILDER */}
      <ExamRuleBuilder
        examId={exam.id}
        courseId={id}
      />

    </div>
  );
}