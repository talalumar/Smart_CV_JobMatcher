import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateInterviewQuestions =
  async (
    primaryRole,
    secondaryRoles = [],
    skills = [],
    experienceLevel = "",
    atsIssues = [],
    matchedJobs = []
  ) => {
    try {
      /*
      STEP 1 → Extract Weak Areas
      */

      let weakAreas = [];

      matchedJobs.forEach((job) => {
        if (job.weakAreas?.length) {
          weakAreas.push(
            ...job.weakAreas
          );
        }
      });

      weakAreas = [
        ...new Set(weakAreas),
      ].slice(0, 10);

      /*
      STEP 2 → AI Dynamic Prompt
      */

      const response =
        await groq.chat.completions.create({
          model:
            "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content: `
You are an expert Technical Interviewer.

Generate personalized interview questions based on candidate profile.

IMPORTANT RULES:

1. Return ONLY valid JSON
2. No markdown
3. No explanation
4. No extra text
5. Questions must be practical and professional
6. Questions should be DIFFERENT every time
7. Questions should target weak areas + ATS issues
8. Questions should match real industry interviews

Return EXACTLY this structure:

{
  "technicalQuestions": [],
  "projectQuestions": [],
  "hrQuestions": [],
  "weakAreaQuestions": [],
  "roleSpecificQuestions": []
}

Candidate Profile:

Primary Role:
${primaryRole}

Secondary Roles:
${secondaryRoles.join(", ")}

Skills:
${skills.join(", ")}

Experience Level:
${experienceLevel}

ATS Issues:
${atsIssues.join(", ")}

Weak Areas:
${weakAreas.join(", ")}

Generate:
- 5 technical questions
- 3 project-based questions
- 3 HR questions
- 3 weak area questions
- 3 role-specific questions
              `,
            },
          ],

          temperature: 0.8,
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
        "Interview Generation Error:",
        error
      );

      throw new Error(
        "Failed to generate interview questions"
      );
    }
  };