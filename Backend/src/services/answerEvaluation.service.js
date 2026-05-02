import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/*
========================================
SAFE JSON PARSER (VERY IMPORTANT)
========================================
*/
const safeJSONParse = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("JSON Parse Error:", text);
    return null;
  }
};

/*
========================================
1. SINGLE ANSWER EVALUATION
========================================
*/
export const evaluateAnswer = async (
  question,
  idealAnswer,
  userAnswer
) => {
  try {
    const prompt = `
You are a senior technical interviewer.

Evaluate the candidate answer strictly.

Return ONLY valid JSON.

{
  "score": 0,
  "feedback": "",
  "improvement": "",
  "correctAnswer": ""
}

Question:
${question}

Ideal Answer:
${idealAnswer}

Candidate Answer:
${userAnswer}
`;

    const response =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
      });

    const text =
      response.choices[0].message.content;

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = safeJSONParse(cleaned);

    if (!parsed) {
      return {
        score: 0,
        feedback: "Could not evaluate answer properly",
        improvement: "Try again",
        correctAnswer: "N/A",
      };
    }

    return parsed;
  } catch (error) {
    console.error(error);

    return {
      score: 0,
      feedback: "Evaluation failed",
      improvement: "Try again",
      correctAnswer: "N/A",
    };
  }
};

/*
========================================
2. FULL INTERVIEW EVALUATION
========================================
*/
export const evaluateFullInterview = async (
  answersArray // [{ question, idealAnswer, userAnswer }]
) => {
  try {
    const formattedAnswers =
      answersArray
        .map(
          (item, i) => `
Q${i + 1}: ${item.question}
Ideal: ${item.idealAnswer}
User: ${item.userAnswer}
`
        )
        .join("\n");

    const prompt = `
You are a senior technical interviewer.

Evaluate full interview.

Return ONLY valid JSON.

{
  "overallScore": 0,
  "feedback": "",
  "strongAreas": [],
  "improvementAreas": [],
  "evaluatedAnswers": [
    {
      "question": "",
      "userAnswer": "",
      "score": 0,
      "feedback": "",
      "correctAnswer": ""
    }
  ]
}

Rules:
- Each answer score out of 10
- Overall score out of 100
- Be strict and realistic

Interview:
${formattedAnswers}
`;

    const response =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
      });

    const text =
      response.choices[0].message.content;

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = safeJSONParse(cleaned);

    if (!parsed) {
      return {
        overallScore: 0,
        feedback: "Evaluation failed",
        strongAreas: [],
        improvementAreas: [],
        evaluatedAnswers: [],
      };
    }

    return parsed;
  } catch (error) {
    console.error(error);

    return {
      overallScore: 0,
      feedback: "Evaluation failed",
      strongAreas: [],
      improvementAreas: [],
      evaluatedAnswers: [],
    };
  }
};