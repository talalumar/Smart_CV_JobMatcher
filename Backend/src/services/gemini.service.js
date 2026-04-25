import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const extractResumeData = async (resumeText) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
You are an expert ATS resume analyzer.
Analyze this resume and return ONLY valid JSON with no extra text.

{
  "skills": [],
  "experienceLevel": "",
  "jobRoles": [],
  "summary": ""
}

Resume:
${resumeText}
          `,
        },
      ],
    });

    const text = response.choices[0].message.content;
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);

  } catch (error) {
    console.error(error);
    throw new Error("Resume analysis failed");
  }
};