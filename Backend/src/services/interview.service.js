import Groq from "groq-sdk";
import Resume from "../models/Resume.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateInterviewQuestions = async (resumeId) => {
  try {
    /*
    STEP 1 → Get Resume from DB
    */

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      throw new Error("Resume not found");
    }

    const {
      primaryRole,
      secondaryRoles = [],
      skills = [],
      experienceLevel = "",
      atsIssues = [],
      matchedJobs = [],
    } = resume;

    /*
    STEP 2 → Extract Weak Areas
    */

    let weakAreas = [];

    matchedJobs.forEach((job) => {
      if (job.weakAreas?.length) {
        weakAreas.push(...job.weakAreas);
      }
    });

    weakAreas = [...new Set(weakAreas)].slice(0, 10);

    /*
    STEP 3 → AI Prompt
    */

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
You are an expert Technical Interviewer.

Generate personalized interview questions.

STRICT RULES:
- Return ONLY JSON
- No markdown
- No explanation

FORMAT:
{
  "technicalQuestions": [],
  "projectQuestions": [],
  "hrQuestions": [],
  "weakAreaQuestions": [],
  "roleSpecificQuestions": []
}

Candidate:

Primary Role: ${primaryRole}
Secondary Roles: ${secondaryRoles.join(", ")}
Skills: ${skills.join(", ")}
Experience: ${experienceLevel}

ATS Issues: ${atsIssues.join(", ")}
Weak Areas: ${weakAreas.join(", ")}

Generate:
- 5 technical
- 3 project
- 3 HR
- 3 weak area
- 3 role-specific
          `,
        },
      ],
      temperature: 0.8,
    });

    const text = response.choices[0].message.content;

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    /*
    STEP 4 → Safe Parse
    */

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      console.error("JSON Parse Error:", cleaned);

      return {
        technicalQuestions: [],
        projectQuestions: [],
        hrQuestions: [],
        weakAreaQuestions: [],
        roleSpecificQuestions: [],
      };
    }
  } catch (error) {
    console.error("Interview Generation Error:", error);

    throw new Error("Failed to generate interview questions");
  }
};