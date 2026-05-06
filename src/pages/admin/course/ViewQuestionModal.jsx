import { useState } from "react";

// 🔥 shuffle + simpan index asli
function shuffleArray(array) {
  const arr = array.map((val, index) => ({ val, index }));

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export default function ViewQuestionModal({ data, onClose }) {

  const [answer, setAnswer] = useState(null);

  const letters = ["A", "B", "C", "D", "E"];

  // 🔥 shuffle sekali saat render
  const [shuffled] = useState(() => {
    if (!data.options) return [];
    return shuffleArray(data.options);
  });

  // 🔥 ambil correct lama
  const getCorrectIndexes = () => {
    if (!data.correct_answer && data.correct_answer !== 0) return [];

    if (Array.isArray(data.correct_answer)) {
      return data.correct_answer;
    }

    return [data.correct_answer];
  };

  const correctIndexes = getCorrectIndexes();

  // 🔥 mapping ke posisi baru
  const mappedCorrect = shuffled
    .map((item, newIndex) => ({
      newIndex,
      oldIndex: item.index
    }))
    .filter(x => correctIndexes.includes(x.oldIndex))
    .map(x => x.newIndex);

  // 🔥 cek benar
  const isCorrect = (i) => mappedCorrect.includes(i);

  // 🔥 tampilkan A/B/C
  const formatCorrect = () => {
    if (mappedCorrect.length === 0) return "-";
    return mappedCorrect.map(i => letters[i]).join(", ");
  };

  const renderContent = () => {

    switch (data.type) {

      // ================= MCQ =================
      case "mcq":
        return shuffled.map((item, i) => (
          <label key={i} className="block mb-2 cursor-pointer">

            <input
              type="radio"
              name="ans"
              onChange={() => setAnswer(i)}
              className="mr-2"
            />

            <span className={`font-semibold mr-2 ${isCorrect(i) ? "text-green-600" : ""}`}>
              {letters[i]}.
            </span>

            <span className={isCorrect(i) ? "text-green-600" : ""}>
              {item.val}
            </span>

          </label>
        ));

      // ================= MULTIPLE =================
      case "multiple":
        return shuffled.map((item, i) => (
          <label key={i} className="block mb-2 cursor-pointer">

            <input type="checkbox" className="mr-2" />

            <span className={`font-semibold mr-2 ${isCorrect(i) ? "text-green-600" : ""}`}>
              {letters[i]}.
            </span>

            <span className={isCorrect(i) ? "text-green-600" : ""}>
              {item.val}
            </span>

          </label>
        ));

      // ================= TRUE FALSE =================
      case "true_false":
        return (
          <div className="flex gap-3">
            <button className="border px-4 py-2 rounded">True</button>
            <button className="border px-4 py-2 rounded">False</button>
          </div>
        );

      // ================= SHORT =================
      case "short_answer":
        return (
          <input
            className="border p-2 w-full"
            placeholder="Jawaban..."
          />
        );

      // ================= ESSAY =================
      case "essay":
        return (
          <textarea
            className="border p-2 w-full"
            rows={4}
            placeholder="Jawaban essay..."
          />
        );

      default:
        return <div className="text-gray-500">Preview belum tersedia</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="bg-white w-[700px] p-6 rounded-xl shadow-lg">

        <h3 className="font-bold text-lg mb-4">
          Preview Question
        </h3>

        <div className="mb-4 font-semibold text-gray-800">
          {data.question}
        </div>

        <div className="mb-4">
          {renderContent()}
        </div>

        {/* 🔥 CORRECT ANSWER */}
        <div className="text-sm text-gray-500 mt-4">
          Correct Answer: <span className="font-semibold text-green-600">
            {formatCorrect()}
          </span>
        </div>

        {/* 🔥 EXPLANATION */}
        {data.explanation && (
          <div className="mt-3 text-sm text-gray-600">
            <b>Explanation:</b> {data.explanation}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}