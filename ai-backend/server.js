const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 session memory
let session = {
  step: 0,
  missingSkills: []
};


// ===== ANALYZE =====
app.post("/analyze", async (req, res) => {
  const { jd, resume } = req.body;

  const prompt = `
You are an AI career coach.

Analyze the candidate based on the Job Description and Resume.

Job Description:
${jd}

Resume:
${resume}

Return ONLY in this exact format:

Matched Skills:
- skill1
- skill2

Missing Skills:
- skill1
- skill2
- skill3

Why these skills matter:
- skill1 → short reason
- skill2 → short reason

Learning Plan:
- Skill: skill1
  Resource: YouTube / Docs
  Time: short (1-2 weeks)

Recommended Path:
skill1 → skill2 → skill3

IMPORTANT:
- Extract skills ONLY from Job Description
- Keep output short
- No extra explanation
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 300,
        messages: [
          { role: "system", content: "Strict structured output only." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.json({ error: data.error?.message || "API error" });
    }

    const result = data.choices[0].message.content;
    console.log("AI RESULT:\n", result);

    // ===== SKILL EXTRACTION =====
    let skills = [];

    try {
      const lines = result.split("\n");
      let start = false;

      for (let line of lines) {
        const lower = line.toLowerCase();

        if (lower.includes("missing skills")) {
          start = true;
          continue;
        }

        if (start) {
          if (lower.includes("why these skills")) break;

          const clean = line.replace(/[*\-•]/g, "").trim();
          if (clean && clean.length < 40) {
            skills.push(clean);
          }
        }
      }
    } catch {}

    if (skills.length === 0) {
      skills = ["Core Skill"];
    }

    session.step = 0;
    session.missingSkills = skills;

    res.json({ result });

  } catch (err) {
    console.error("Analyze error:", err.message);
    res.status(500).json({ error: "AI error" });
  }
});


// ===== CHAT =====
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();

  // 🚀 START
  if (msg === "start") {
    if (session.missingSkills.length === 0) {
      return res.json({ reply: "No missing skills detected." });
    }

    session.step = 1;

    return res.json({
      reply: `Have you worked with ${session.missingSkills[0]} in a real project?`
    });
  }

  // 🚀 FLOW
  if (session.step > 0 && session.step <= session.missingSkills.length) {

    session.step++;

    if (session.step <= session.missingSkills.length && session.step <= 3) {
      return res.json({
        reply: `Have you used ${session.missingSkills[session.step - 1]} practically?`
      });
    }

    // 🎯 FINAL PLAN WITH YOUTUBE
    let plan = "📚 Learning Plan:\n";

    session.missingSkills.forEach(skill => {
      const link = `https://www.youtube.com/results?search_query=learn+${encodeURIComponent(skill)}`;
      plan += `\n🔹 ${skill}\n🎥 ${link}\n`;
    });

    plan += "\n👉 Follow this order and build small projects.";

    return res.json({ reply: plan });
  }

  return res.json({
    reply: "Type 'start' to begin assessment."
  });
});


// ===== START SERVER =====
app.listen(3000, () => {
  console.log("🚀 Backend running at http://localhost:3000");
});