import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getAIMatchScore = async (
  resumeText,
  jobDescription
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
You are an expert ATS and job matching system.

Compare this resume with the job description.

Return ONLY valid JSON.

Required JSON format:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengthAreas": [],
  "weakAreas": [],
  "recommendation": ""
}

Rules:
- score must be from 0 to 100
- recommendation should be short and professional
- matchedSkills = present in both
- missingSkills = required but missing
- strengthAreas = strong candidate areas
- weakAreas = improvement areas

Resume:
${resumeText}

Job Description:
${jobDescription}
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
      "AI Match Score Error:",
      error
    );

    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      strengthAreas: [],
      weakAreas: [],
      recommendation:
        "Unable to analyze match score",
    };
  }
};