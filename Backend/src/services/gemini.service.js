import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const extractResumeData = async (
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
You are an expert ATS Resume Analyzer, Career Coach, and Job Matching Specialist.

Analyze this resume carefully and return ONLY valid JSON.

Do NOT return markdown.
Do NOT return explanation.
Do NOT return extra text.

Return EXACTLY this structure:

{
  "skills": [],
  "experienceLevel": "",
  "primaryRole": "",
  "secondaryRoles": [],
  "summary": "",

  "atsScore": 0,
  "atsIssues": [],
  "atsSuggestions": [],
  "atsStrengths": [],

  "careerSuggestions": [],
  "improvementPlan": [],
  "interviewTips": []
}

Rules:

1. Extract highly relevant technical + professional skills
2. Detect real experience level accurately
3. Identify strongest primary role
4. Identify secondary matching roles
5. Generate strong professional summary

ATS Analysis:
6. Give ATS score out of 100
7. Detect ATS problems
8. Give ATS improvement suggestions
9. Mention ATS strengths

Career Guidance:
10. Give career growth suggestions
11. Give improvement roadmap
12. Give interview preparation tips

Resume:
${resumeText}
            `,
          },
        ],

        temperature: 0.3,
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
      "Groq Resume Analysis Error:",
      error
    );

    throw new Error(
      "AI Resume Analysis Failed"
    );
  }
};