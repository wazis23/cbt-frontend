import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../api/api";

export default function ExamConfirmationPage() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const stored = sessionStorage.getItem(
      "exam_confirmation"
    );

    if (!stored) {

      navigate("/student/token");

      return;
    }

    setData(
      JSON.parse(stored)
    );

  }, []);

  /*
  |--------------------------------------------------------------------------
  | START EXAM
  |--------------------------------------------------------------------------
  */

  const startExam = async () => {

    try {

      setLoading(true);

      const res = await api.post(
        "/exam/start",
        {
          exam_session_id:
            data.exam.exam_session_id,

          token:
            data.token,

          room_id:
            data.exam.room_id,

          device_id:
            navigator.userAgent
        }
      );

      /*
      |--------------------------------------------------------------------------
      | SAVE ATTEMPT
      |--------------------------------------------------------------------------
      */

      sessionStorage.setItem(
        "attempt_id",
        res.data.attempt_id
      );

      /*
      |--------------------------------------------------------------------------
      | REDIRECT
      |--------------------------------------------------------------------------
      */

      navigate(
        `/student/exam/${res.data.attempt_id}`
      );

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data?.error ||
        "Gagal memulai ujian"
      );

    } finally {

      setLoading(false);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-600 text-white p-8">

          <h1 className="text-3xl font-bold">
            Konfirmasi Ujian
          </h1>

          <p className="opacity-90 mt-2">
            Pastikan data ujian sudah benar
          </p>

        </div>

        {/* BODY */}
        <div className="p-8">

          <div className="grid md:grid-cols-2 gap-5">

            {/* EXAM */}
            <div className="border rounded-2xl p-5">

              <div className="text-sm text-gray-500 mb-1">
                Nama Ujian
              </div>

              <div className="font-bold text-lg">
                {data.exam.exam_title || "-"}
              </div>

            </div>

            {/* COURSE */}
            <div className="border rounded-2xl p-5">

              <div className="text-sm text-gray-500 mb-1">
                Mata Pelajaran
              </div>

              <div className="font-bold text-lg">
                {data.exam.course_name || "-"}
              </div>

            </div>

            {/* ROOM */}
            <div className="border rounded-2xl p-5">

              <div className="text-sm text-gray-500 mb-1">
                Ruangan
              </div>

              <div className="font-bold text-lg">
                {data.exam.room_name || "-"}
              </div>

            </div>

            {/* DURATION */}
            <div className="border rounded-2xl p-5">

              <div className="text-sm text-gray-500 mb-1">
                Durasi
              </div>

              <div className="font-bold text-lg">
                {data.exam.duration || 0} Menit
              </div>

            </div>

          </div>

          {/* TOKEN */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">

            <div className="text-sm text-blue-700 mb-2">
              Token Aktif
            </div>

            <div className="text-4xl font-bold tracking-[10px] text-blue-700">
              {data.token}
            </div>

          </div>

          {/* WARNING */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 p-5 rounded-2xl text-sm leading-relaxed">

            <div className="font-semibold mb-2">
              Perhatian
            </div>

            <ul className="list-disc pl-5 space-y-1">

              <li>
                Jangan keluar dari halaman ujian
              </li>

              <li>
                Token akan berubah setiap beberapa menit
              </li>

              <li>
                Jika logout maka wajib memasukkan token terbaru
              </li>

              <li>
                Pelanggaran dapat menyebabkan akun terkunci
              </li>

            </ul>

          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3 mt-8">

            <button
              onClick={() =>
                navigate("/student/token")
              }
              className="px-6 py-3 rounded-xl border"
            >
              Kembali
            </button>

            <button
              onClick={startExam}

              disabled={loading}

              className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-xl font-semibold"
            >
              {
                loading
                  ? "Memulai..."
                  : "Mulai Ujian"
              }
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}