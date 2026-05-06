export default function Question({ q, onAnswer }) {
  return (
    <div>
      <h3>{q.question}</h3>
      {q.options.map(opt => (
        <button key={opt} onClick={() => onAnswer(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}