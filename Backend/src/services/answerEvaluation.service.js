import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const evaluateAnswer = async (
  question,
  idealAnswer,
  userAnswer
) => {
  try {
    const prompt = `
You are a senior technical interviewer and answer evaluator.

Your job is to evaluate the candidate's answer professionally.

Return ONLY valid JSON.

{
  "score": 0,
  "feedback": "",
  "improvement": "",
  "correctAnswer": ""
}

Evaluation Rules:

1. Score should be between 0 to 100
2. feedback = what was good
3. improvement = what is missing
4. correctAnswer = ideal professional answer

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
      });

    const text =
      response.choices[0].message.content;

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error(error);
    throw new Error(
      "Answer evaluation failed"
    );
  }
};