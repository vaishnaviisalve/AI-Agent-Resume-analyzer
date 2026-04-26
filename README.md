# 🚀 AI Skill Assessment & Personalized Learning Agent

## 📌 Overview

This project is an AI-powered agent that evaluates a candidate’s **real skill proficiency** instead of just analyzing their resume.

It compares a **Job Description (JD)** with a **candidate’s resume**, identifies skill gaps, assesses skills through conversation, and generates a **personalized learning plan with resources**.

---

## ✨ Features

* ✅ Resume vs Job Description analysis
* ❌ Missing skill detection
* 💬 Conversational skill assessment (chat-based)
* 📊 Skill scoring system (per-skill + overall)
* 🧠 Explanation: *Why skills matter*
* 🎯 Recommended learning path
* 🎥 YouTube learning resources (clickable)
* 🌍 Works for multiple domains (tech, analytics, marketing)

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js + Express
* **AI API:** Groq (LLaMA model)
* **Styling:** CSS (Glass UI + Gradient design)

---

## ⚙️ How It Works

1. User inputs **Job Description** and **Resume**
2. AI extracts:

   * Matched Skills
   * Missing Skills
3. System explains:

   * Why each skill matters
4. Chat-based assessment begins:

   * Asks real-world questions
   * Evaluates responses
5. Generates:

   * Skill score
   * Personalized learning plan
   * Recommended skill path
   * Learning resources (YouTube)

---

## 🧪 Sample Input

**Job Description:**
Backend Developer (Node.js, Express, MongoDB)

**Resume:**
Basic JavaScript knowledge, small projects

---

## 📊 Sample Output

Matched Skills:
- JavaScript  

Missing Skills:
- Node.js  
- Express  
- MongoDB  

Score: 55%

Learning Plan:
- Node.js → YouTube  
- Express → YouTube  
- MongoDB → YouTube  
---

## 🏗️ Architecture

Frontend (React)
⬇
Backend (Node.js / Express)
⬇
Groq AI API
⬇
Skill Extraction + Chat Assessment
⬇
Scoring + Learning Plan

---

## 🎯 Scoring Logic

* Yes → Strong (3)
* Partial → Average (2)
* No → Weak (1)

Overall Score = (User Score / Max Score) × 100

---

## ⚖️ Trade-offs

- Simple scoring system for fast evaluation  
- Focused on usability over complex ML models  
- Used external AI API instead of training custom models  

---

## 🚀 How to Run Locally

### 1. Clone Repository

```bash
git clone <your-repo-link>
cd project-folder
```

### 2. Backend Setup

```bash
cd backend
npm install
node server.js

create .env file:
GROQ_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🎥 Demo

https://drive.google.com/file/d/1ZxAwDxZYIlSvfUDVqaj7gBu9aDJzdOq3/view?usp=drive_link

---

## 🌟 Key Highlight

> This system goes beyond resume screening by evaluating real skills through interaction and guiding users with a structured learning path.
---

## 📜 License

For educational and hackathon use.
