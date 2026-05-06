import { useEffect, useState } from "react";
import api from "../api/api";
import Timer from "../components/Timer";
import Question from "../components/Question";
import { initAntiCheat } from "../components/AntiCheat";

export default function Exam() {

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [attemptId, setAttemptId] = useState(null);

  useEffect(() => {
    startExam();
  }, []);

  const fullscreen = () => document.documentElement.requestFullscreen();

  const startExam = async () => {
    const res = await api.post("/exam/start", {
      exam_session_id: localStorage.getItem("exam_session_id")
    });

    setAttemptId(res.data.attempt_id);
    fullscreen();
    initAntiCheat(res.data.attempt_id);

    loadExam();
  };

  const loadExam = async () => {
    const res = await api.get(`/exam/resume/${localStorage.getItem("exam_session_id")}`);
    setQuestions(res.data.exam.questions);
  };

  const answer = async (val) => {
    await api.post("/exam/answer", {
      attempt_id: attemptId,
      question_id: questions[current].id,
      answer: val
    });
  };

  const submit = async () => {
    if (!confirm("Yakin submit?")) return;
    if (!confirm("Tidak bisa diubah lagi!")) return;

    await api.post("/exam/submit", { attempt_id: attemptId });

    document.exitFullscreen();
    window.location.href = "/result";
  };

  return (
    <div style={{ padding: 20 }}>
      {attemptId && <Timer attemptId={attemptId} />}

      {questions.length > 0 && (
        <Question q={questions[current]} onAnswer={answer} />
      )}

      <br/>
      <button onClick={() => setCurrent(c => Math.max(0, c - 1))}>Prev</button>
      <button onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}>Next</button>

      <br/><br/>
      <button onClick={submit}>Submit</button>
    </div>
  );
}