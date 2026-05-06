import { useMemo, useState } from "react";

import api from "../../../../api/api";

export default function CreateExamModal({
  courseId,
  onClose,
  onSuccess
}) {

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const [form, setForm] = useState({

    /*
    |--------------------------------------------------------------------------
    | BASIC
    |--------------------------------------------------------------------------
    */

    title: "",

    type: "official",

    duration: 90,

    start_time: "",

    end_time: "",

    /*
    |--------------------------------------------------------------------------
    | CBT
    |--------------------------------------------------------------------------
    */

    max_attempt: 1,

    score_rule: "highest",

    show_score: true,

    is_active: true,

    /*
    |--------------------------------------------------------------------------
    | SCORING
    |--------------------------------------------------------------------------
    */

    scoring_mode: "auto",

    max_score: 100
  });

  const [loading, setLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CHANGE
  |--------------------------------------------------------------------------
  */

  const change = (key, value) => {

    setForm({
      ...form,
      [key]: value
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SCORE PREVIEW
  |--------------------------------------------------------------------------
  */

  const estimatedQuestionCount = 40;

  const autoScorePerQuestion = useMemo(() => {

    if (
      form.scoring_mode !== "auto"
    ) {
      return 0;
    }

    return (
      Number(form.max_score || 0)
      / estimatedQuestionCount
    ).toFixed(2);

  }, [
    form.max_score,
    form.scoring_mode
  ]);

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const submit = async () => {

    try {

      setLoading(true);

      await api.post(
        `/admin/courses/${courseId}/exams`,
        form
      );

      onSuccess();

      onClose();

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Gagal membuat exam"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 overflow-auto">

      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white px-8 py-7">

          <div className="flex justify-between items-start">

            <div>

              <h2 className="text-3xl font-bold">
                Create Exam
              </h2>

              <p className="text-blue-100 mt-2 text-sm">
                Buat ujian CBT modern untuk course ini
              </p>

            </div>

            <div className="bg-white/10 px-4 py-2 rounded-2xl text-sm">

              CBT Builder

            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8 bg-gray-50">

          {/* BASIC */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h3 className="font-bold text-xl text-gray-800">
                  Basic Information
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Informasi dasar ujian
                </p>

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {/* TITLE */}
              <div className="md:col-span-2">

                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Exam Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    change(
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: UTS Matematika Kelas 12"
                />

              </div>

              {/* TYPE */}
              <div>

                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Exam Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    change(
                      "type",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4"
                >

                  <option value="official">
                    Official Exam
                  </option>

                  <option value="harian">
                    Harian / Quiz
                  </option>

                </select>

              </div>

              {/* DURATION */}
              <div>

                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Duration (Minutes)
                </label>

                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    change(
                      "duration",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4"
                />

              </div>

            </div>

          </div>

          {/* SCHEDULE */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <div className="mb-6">

              <h3 className="font-bold text-xl text-gray-800">
                Schedule
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Atur waktu pelaksanaan ujian
              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {/* START */}
              <div>

                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Start Time
                </label>

                <input
                  type="datetime-local"
                  value={form.start_time}
                  onChange={(e) =>
                    change(
                      "start_time",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4"
                />

              </div>

              {/* END */}
              <div>

                <label className="text-sm font-medium text-gray-700 block mb-2">
                  End Time
                </label>

                <input
                  type="datetime-local"
                  value={form.end_time}
                  onChange={(e) =>
                    change(
                      "end_time",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4"
                />

              </div>

            </div>

          </div>

          {/* CBT SETTINGS */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <div className="mb-6">

              <h3 className="font-bold text-xl text-gray-800">
                CBT Settings
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Pengaturan sistem CBT
              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {/* MAX ATTEMPT */}
              <div>

                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Max Attempt
                </label>

                <input
                  type="number"
                  value={form.max_attempt}
                  onChange={(e) =>
                    change(
                      "max_attempt",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4"
                />

              </div>

              {/* SCORE RULE */}
              <div>

                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Score Rule
                </label>

                <select
                  value={form.score_rule}
                  onChange={(e) =>
                    change(
                      "score_rule",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4"
                >

                  <option value="highest">
                    Highest Score
                  </option>

                  <option value="last">
                    Last Attempt
                  </option>

                </select>

              </div>

            </div>

            {/* TOGGLES */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">

              <label className="flex items-center justify-between border rounded-2xl px-5 py-4">

                <div>

                  <div className="font-medium">
                    Show Score
                  </div>

                  <div className="text-sm text-gray-500">
                    Tampilkan nilai ke siswa
                  </div>

                </div>

                <input
                  type="checkbox"
                  checked={form.show_score}
                  onChange={(e) =>
                    change(
                      "show_score",
                      e.target.checked
                    )
                  }
                />

              </label>

              <label className="flex items-center justify-between border rounded-2xl px-5 py-4">

                <div>

                  <div className="font-medium">
                    Activate Exam
                  </div>

                  <div className="text-sm text-gray-500">
                    Exam langsung aktif
                  </div>

                </div>

                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    change(
                      "is_active",
                      e.target.checked
                    )
                  }
                />

              </label>

            </div>

          </div>

          {/* SCORING */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <div className="mb-6">

              <h3 className="font-bold text-xl text-gray-800">
                Scoring System
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Sistem perhitungan nilai ujian
              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {/* MODE */}
              <div>

                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Scoring Mode
                </label>

                <select
                  value={form.scoring_mode}
                  onChange={(e) =>
                    change(
                      "scoring_mode",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4"
                >

                  <option value="auto">
                    Automatic Distribution
                  </option>

                  <option value="manual">
                    Manual Per Question
                  </option>

                </select>

              </div>

              {/* MAX SCORE */}
              <div>

                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Maximum Score
                </label>

                <input
                  type="number"
                  value={form.max_score}
                  onChange={(e) =>
                    change(
                      "max_score",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4"
                />

              </div>

            </div>

            {/* INFO CARD */}
            <div className={`mt-6 rounded-3xl p-6 border ${
              form.scoring_mode === "auto"
                ? "bg-blue-50 border-blue-100"
                : "bg-orange-50 border-orange-100"
            }`}>

              {form.scoring_mode === "auto" ? (

                <div>

                  <div className="font-bold text-blue-700 text-lg">
                    Automatic Distribution
                  </div>

                  <p className="text-blue-600 mt-2 text-sm leading-relaxed">
                    Nilai ujian akan dibagi rata
                    berdasarkan jumlah soal yang
                    di-generate dari rule builder.
                  </p>

                  <div className="mt-4 bg-white rounded-2xl px-5 py-4 inline-block border border-blue-100">

                    <div className="text-xs text-gray-500">
                      Estimasi nilai per soal
                    </div>

                    <div className="text-2xl font-bold text-blue-700 mt-1">
                      {autoScorePerQuestion}
                    </div>

                  </div>

                </div>

              ) : (

                <div>

                  <div className="font-bold text-orange-700 text-lg">
                    Manual Per Question
                  </div>

                  <p className="text-orange-600 mt-2 text-sm leading-relaxed">
                    Sistem akan menggunakan
                    score masing-masing soal
                    pada Question Bank.
                  </p>

                  <div className="mt-4 bg-white rounded-2xl px-5 py-4 inline-block border border-orange-100">

                    <div className="text-xs text-gray-500">
                      Source
                    </div>

                    <div className="text-xl font-bold text-orange-700 mt-1">
                      Question Score
                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="bg-white border-t px-8 py-5 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 font-semibold"
          >

            {loading
              ? "Creating..."
              : "Create Exam"}

          </button>

        </div>

      </div>
    </div>
  );
}