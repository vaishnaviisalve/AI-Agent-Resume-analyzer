import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  // 🔥 skill scoring
  const [skillScores, setSkillScores] = useState({});
  const [missingSkills, setMissingSkills] = useState([]);

  // ===== ANALYZE =====
  const analyze = async () => {
    if (!jd || !resume) return alert("Enter both fields");

    try {
      const res = await axios.post("http://localhost:3000/analyze", { jd, resume });

      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      const output = res.data.result;
      setResult(output);

      // 🔥 extract missing skills properly
      let skills = [];
      try {
        const lines = output.split("\n");
        let start = false;

        for (let line of lines) {
          const lower = line.toLowerCase();

          if (lower.includes("missing skills")) {
            start = true;
            continue;
          }

          if (start) {
            if (lower.includes("learning plan")) break;

            const clean = line.replace(/[-*•]/g, "").trim();
            if (clean) skills.push(clean);
          }
        }
      } catch {}

      setMissingSkills(skills);
      setSkillScores({});
      setScore(null);

      setChat([
        { type: "bot", text: "🤖 Analysis done!" },
        { type: "bot", text: "👉 Type 'start' to begin skill assessment." }
      ]);

    } catch {
      alert("Error analyzing");
    }
  };

  // ===== CALCULATE SCORE =====
  const calculateScore = () => {
    const values = Object.values(skillScores);
    if (values.length === 0) return null;

    const total = values.reduce((a, b) => a + b, 0);
    const max = values.length * 3;

    return Math.round((total / max) * 100);
  };

  // ===== CHAT =====
  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = message.toLowerCase();

    // 🔥 scoring logic (correct mapping)
    const index = Object.keys(skillScores).length;
    const currentSkill = missingSkills[index];

    if (currentSkill) {
      let val = 2;
      if (userMsg.includes("yes")) val = 3;
      else if (userMsg.includes("no")) val = 1;

      setSkillScores(prev => ({
        ...prev,
        [currentSkill]: val
      }));
    }

    // UI update
    setChat(prev => [
      ...prev,
      { type: "user", text: message },
      { type: "bot", text: "⏳ Thinking..." }
    ]);

    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/chat", {
        message,
        context: result
      });

      setChat(prev => prev.slice(0, -1));

      if (res.data.error) {
        setChat(prev => [...prev, { type: "bot", text: "❌ " + res.data.error }]);
      } else {
        setChat(prev => [...prev, { type: "bot", text: res.data.reply }]);
      }

    } catch {
      setChat(prev => [...prev, { type: "bot", text: "❌ Error" }]);
    }
  };

  const sendMessage = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // ===== FORMAT RESULT =====
  const formatResult = (text) => {
    let matched = "", missing = "", plan = "";

    try {
      if (text.includes("Matched Skills"))
        matched = text.split("Missing Skills")[0].replace("Matched Skills:", "");

      if (text.includes("Missing Skills"))
        missing = text.split("Missing Skills")[1].split("Learning Plan")[0];

      if (text.includes("Learning Plan"))
        plan = text.split("Learning Plan")[1];
    } catch {
      return <pre>{text}</pre>;
    }

    return (
      <>
        <div className="resultCard green">
          <h4>✅ Matched Skills</h4>
          <pre>{matched}</pre>
        </div>

        <div className="resultCard red">
          <h4>❌ Missing Skills</h4>
          <pre>{missing}</pre>
        </div>

        <div className="resultCard blue">
          <h4>📚 Learning Plan</h4>
          <pre>{plan}</pre>
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <h1>🚀 AI Career Agent</h1>

      {/* INPUT */}
      <div className="glass">
        <label>📄 Job Description</label>
        <textarea
          placeholder="Paste Job Description..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

        <label>📄 Resume</label>
        <textarea
          placeholder="Paste Resume..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <button onClick={analyze}>Analyze</button>
      </div>

      {/* SCORE */}
      {(score || calculateScore()) && (
        <div className="card score">
          🎯 Overall Score: {calculateScore() || score}%
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="resultContainer">
          {formatResult(result)}
        </div>
      )}

      {/* SKILL SCORES */}
      {Object.keys(skillScores).length > 0 && (
        <div className="resultContainer">
          {Object.entries(skillScores).map(([skill, val], i) => (
            <div key={i} className="resultCard">
              <h4>{skill}</h4>
              <p>
                {val === 3 ? "Strong ✅" : val === 2 ? "Average ⚠️" : "Weak ❌"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CHAT */}
      <div className="chat">
        <div className="chatBox">
          {chat.map((msg, i) => (
            <div key={i} className={`message ${msg.type}`}>
              {msg.text.split("\n").map((line, index) => {

                // 🎥 detect youtube link
                if (line.includes("youtube.com")) {
                  return (
                    <a
                      key={index}
                      href={line.replace("🎥 ", "").trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ytBtn"
                    >
                      🎥 Watch Video
                    </a>
                  );
                }

                return <div key={index}>{line}</div>;
              })}
            </div>
          ))}
        </div>

        <div className="chatInputArea">
          <input
            value={message}
            placeholder="💬 Type 'start' or answer..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={sendMessage}
          />

          <button className="sendBtn" onClick={handleSend}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;