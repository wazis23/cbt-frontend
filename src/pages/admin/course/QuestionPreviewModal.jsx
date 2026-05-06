import { useState } from "react";

export default function QuestionPreviewModal({ question, onClose }) {

  const [answer, setAnswer] = useState(null);

  const renderQuestion = () => {

    switch (question.type) {

      case "mcq":
        return question.options?.map((opt, i) => (
          <label key={i} className="block mb-2">
            <input
              type="radio"
              name="answer"
              onChange={() => setAnswer(i)}
              className="mr-2"
            />
            {opt}
          </label>
        ));

      case "multiple":
        return question.options?.map((opt, i) => (
          <label key={i} className="block mb-2">
            <input type="checkbox" className="mr-2" />
            {opt}
          </label>
        ));

      case "true_false":
        return (
          <>
            <button onClick={() => setAnswer(0)} className="mr-2">True</button>
            <button onClick={() => setAnswer(1)}>False</button>
          </>
        );

      case "short_answer":
        return (
          <input
            className="border p-2 w-full"
            placeholder="Jawaban..."
          />
        );

      case "essay":
        return (
          <textarea className="border p-2 w-full" rows={4} />
        );

      default:
        return <div>Tidak support preview</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-white w-[700px] rounded-xl p-6 shadow">

        <h3 className="font-bold text-lg mb-4">Preview Question</h3>

        <div className="mb-4 font-semibold">
          {question.question}
        </div>

        <div className="mb-4">
          {renderQuestion()}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}