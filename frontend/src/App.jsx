import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAgent = async () => {
    const response = await fetch(
      `http://localhost:5000/api/ai?question=${encodeURIComponent(question)}`
    );

    const data = await response.json();
    setAnswer(data?.answer);
  };

  return (
    <div>
      <h1>Crypto Analysis Agent</h1>

      <input
        type="text"
        placeholder="Ask about a cryptocurrency..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={askAgent}>Ask Agent</button>

      {answer && <p>{answer}</p>}
    </div>
  );
}

export default App;