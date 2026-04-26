import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getATSScore = async (
  resumeText
) => {
  try {
    const response =
      await groq.chat.completions.create({
        model:
          "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: `
You are an expert ATS Resume Analyzer.

Analyze this resume and return ONLY valid JSON.

Required JSON format:

{
  "atsScore": 0,
  "issues": [],
  "suggestions": [],
  "strengths": []
}

Rules:
- atsScore must be from 0 to 100
- issues = current problems in resume
- suggestions = professional improvements
- strengths = strong areas already present
- do not return markdown
- do not return explanation

Resume:
${resumeText}
            `,
          },
        ],

        temperature: 0.2,
      });

    const text =
      response.choices[0].message.content;

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error(
      "ATS Score Error:",
      error
    );

    return {
      atsScore: 0,
      issues: [],
      suggestions: [],
      strengths: [],
    };
  }
};