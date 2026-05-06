import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/api";

export default function ExamPage() {

  const { attemptId } = useParams();

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);

  const [attempt, setAttempt] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState({});

  const [current, setCurrent] = useState(0);

  const [remaining, setRemaining] = useState(0);

  const [saving, setSaving] = useState(false);

  const [warning, setWarning] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD EXAM
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadExam();

  }, []);

  const loadExam = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        `/exam/resume/${attemptId}`
      );

      setAttempt(res.data);

      /*
      |--------------------------------------------------------------------------
      | QUESTIONS
      |--------------------------------------------------------------------------
      */

      const q =
        res.data.exam_questions ||
        res.data.examQuestions ||
        [];

      setQuestions(q);

      /*
      |--------------------------------------------------------------------------
      | ANSWERS
      |--------------------------------------------------------------------------
      */

      const ans = {};

      (res.data.answers || []).forEach(a => {

        ans[a.question_id] = a.answer;
      });

      setAnswers(ans);

      /*
      |--------------------------------------------------------------------------
      | TIMER
      |--------------------------------------------------------------------------
      */

      loadTimer();

    } catch (err) {

      console.error(err);

      alert("Gagal load exam");

    } finally {

      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TIMER
  |--------------------------------------------------------------------------
  */

  const loadTimer = async () => {

    try {

      const res = await api.get(
        `/exam/timer/${attemptId}`
      );

      if (res.data.status === "finished") {

        alert("Ujian selesai");

        navigate("/student/token");

        return;
      }

      if (res.data.status === "expired") {

        alert("Waktu habis");

        navigate("/student/token");

        return;
      }

      setRemaining(
        res.data.remaining_seconds
      );

    } catch (err) {

      console.error(err);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TIMER LOOP
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const interval = setInterval(() => {

      setRemaining(prev => {

        if (prev <= 1) {

          clearInterval(interval);

          alert("Waktu habis");

          navigate("/student/token");

          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  /*
  |--------------------------------------------------------------------------
  | HEARTBEAT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        await api.post(
          "/exam/heartbeat",
          {
            attempt_id: attemptId
          }
        );

      } catch (err) {

        console.error(err);
      }

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  /*
  |--------------------------------------------------------------------------
  | WARNING CHECK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        const res = await api.post(
            `/exam/warning/check`,
            {
                attempt_id: attemptId
            }
        );
        
        if (res.data.warning) {

          setWarning(
            res.data.warning
          );
        }

      } catch (err) {

        console.error(err);
      }

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  /*
  |--------------------------------------------------------------------------
  | ANTI TAB SWITCH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const handler = async () => {

      if (document.hidden) {

        try {

          await api.post(
            "/exam/violation",
            {
              attempt_id: attemptId
            }
          );

        } catch (err) {

          alert(
            "Anda keluar dari ujian"
          );

          navigate("/");

        }
      }
    };

    document.addEventListener(
      "visibilitychange",
      handler
    );

    return () => {

      document.removeEventListener(
        "visibilitychange",
        handler
      );
    };

  }, []);

  /*
  |--------------------------------------------------------------------------
  | FULLSCREEN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      document.documentElement.requestFullscreen
    ) {

      document.documentElement.requestFullscreen();
    }

  }, []);

  /*
  |--------------------------------------------------------------------------
  | SAVE ANSWER
  |--------------------------------------------------------------------------
  */

  const saveAnswer = async (
    questionId,
    value
  ) => {

    try {

      setSaving(true);

      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));

      await api.post(
        "/exam/answer",
        {
          attempt_id: attemptId,
          question_id: questionId,
          answer: value
        }
      );

    } catch (err) {

      console.error(err);

    } finally {

      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const submitExam = async () => {

    const ok = confirm(
      "Yakin submit ujian?"
    );

    if (!ok) return;

    try {

      await api.post(
        "/exam/submit",
        {
          attempt_id: attemptId
        }
      );

      alert("Ujian selesai");

      navigate("/student/token");

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data?.error ||
        "Gagal submit"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FORMAT TIME
  |--------------------------------------------------------------------------
  */

  const formatTime = (sec) => {

    const h = Math.floor(sec / 3600);

    const m = Math.floor(
      (sec % 3600) / 60
    );

    const s = sec % 60;

    return `${h
      .toString()
      .padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        Loading Exam...

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | CURRENT QUESTION
  |--------------------------------------------------------------------------
  */

  const item = questions[current];

  const q = item?.question;

  if (!q) {

    return (
      <div className="p-10">
        Soal tidak ditemukan
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow sticky top-0 z-20">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>

            <div className="font-bold text-xl">
              CBT Exam
            </div>

            <div className="text-sm text-gray-500">
              Soal {current + 1} dari {questions.length}
            </div>

          </div>

          {/* TIMER */}
          <div className="text-right">

            <div className="text-sm text-gray-500">
              Sisa Waktu
            </div>

            <div className="text-3xl font-bold text-red-600">
              {formatTime(remaining)}
            </div>

          </div>

        </div>

      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-[1fr_320px] gap-6">

        {/* QUESTION */}
        <div className="bg-white rounded-3xl shadow p-8">

          {/* QUESTION TEXT */}
          <div className="mb-8">

            <div className="text-sm text-gray-500 mb-2">
              Pertanyaan
            </div>

            <div className="text-xl font-semibold leading-relaxed">
              {q.question}
            </div>

          </div>

          {/* OPTIONS */}
          <div className="space-y-4">

            {/* MCQ */}
            {(q.type === "mcq" ||
              q.type === "multiple") &&

              q.options?.map((opt, i) => (

                <label
                  key={i}
                  className="border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                >

                  <input
                    type={
                      q.type === "mcq"
                        ? "radio"
                        : "checkbox"
                    }

                    checked={
                      q.type === "mcq"

                        ? answers[q.id] == i

                        : (
                          answers[q.id] || []
                        ).includes(i)
                    }

                    onChange={(e) => {

                      if (q.type === "mcq") {

                        saveAnswer(
                          q.id,
                          i
                        );

                      } else {

                        let arr =
                          answers[q.id] || [];

                        if (e.target.checked) {

                          arr = [...arr, i];

                        } else {

                          arr = arr.filter(
                            x => x !== i
                          );
                        }

                        saveAnswer(
                          q.id,
                          arr
                        );
                      }
                    }}
                  />

                  <div>
                    <span className="font-semibold mr-2">
                      {
                        ["A","B","C","D","E"][i]
                      }.
                    </span>

                    {opt}
                  </div>

                </label>
              ))}

            {/* TRUE FALSE */}
            {q.type === "true_false" && (

              <div className="flex gap-4">

                <button
                  onClick={() =>
                    saveAnswer(q.id, 1)
                  }
                  className={`px-6 py-3 rounded-xl border ${
                    answers[q.id] == 1
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                >
                  True
                </button>

                <button
                  onClick={() =>
                    saveAnswer(q.id, 0)
                  }
                  className={`px-6 py-3 rounded-xl border ${
                    answers[q.id] == 0
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                >
                  False
                </button>

              </div>
            )}

            {/* SHORT */}
            {q.type === "short_answer" && (

              <input
                className="w-full border rounded-2xl p-4"

                placeholder="Jawaban..."

                value={
                  answers[q.id] || ""
                }

                onChange={(e) =>
                  saveAnswer(
                    q.id,
                    e.target.value
                  )
                }
              />
            )}

            {/* ESSAY */}
            {q.type === "essay" && (

              <textarea
                className="w-full border rounded-2xl p-4"

                rows={8}

                placeholder="Jawaban essay..."

                value={
                  answers[q.id] || ""
                }

                onChange={(e) =>
                  saveAnswer(
                    q.id,
                    e.target.value
                  )
                }
              />
            )}

          </div>

          {/* NAVIGATION */}
          <div className="flex justify-between mt-10">

            <button
              disabled={current === 0}

              onClick={() =>
                setCurrent(prev => prev - 1)
              }

              className="px-6 py-3 border rounded-2xl disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={
                current === questions.length - 1
              }

              onClick={() =>
                setCurrent(prev => prev + 1)
              }

              className="px-6 py-3 bg-blue-600 text-white rounded-2xl disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

        {/* SIDEBAR */}
        <div className="space-y-5">

          {/* STATUS */}
          <div className="bg-white rounded-3xl shadow p-6">

            <div className="font-bold mb-4">
              Status
            </div>

            <div className="text-sm text-gray-500 mb-2">
              Autosave:
            </div>

            <div className={
              saving
                ? "text-orange-500"
                : "text-green-600"
            }>
              {
                saving
                  ? "Saving..."
                  : "Saved"
              }
            </div>

          </div>

          {/* NAVIGATOR */}
          <div className="bg-white rounded-3xl shadow p-6">

            <div className="font-bold mb-4">
              Navigator Soal
            </div>

            <div className="grid grid-cols-5 gap-3">

              {questions.map((item, i) => {

                const qq = item.question;

                const answered =
                  answers[qq.id] !== undefined;

                return (
                  <button
                    key={i}

                    onClick={() =>
                      setCurrent(i)
                    }

                    className={`h-12 rounded-xl font-semibold transition ${
                      current === i
                        ? "bg-blue-600 text-white"
                        : answered
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}

            </div>

          </div>

          {/* SUBMIT */}
          <button
            onClick={submitExam}
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-4 rounded-2xl font-bold shadow-lg"
          >
            Submit Exam
          </button>

        </div>

      </div>

      {/* WARNING */}
      {warning && (

        <div className="fixed bottom-5 right-5 bg-yellow-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50">

          <div className="font-bold mb-1">
            Warning Proktor
          </div>

          <div>
            {warning}
          </div>

        </div>
      )}

    </div>
  );
}