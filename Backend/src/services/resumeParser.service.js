import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

import Resume from "../models/Resume.js";
import { fetchPriorityJobs } from "./jobFetcher.service.js";
import { extractResumeData } from "./gemini.service.js";
import { getAIMatchScore } from "./aiMatchScore.service.js";

const cleanText = (text) => {
  return text.replace(/\s+/g, " ").trim();
};

const parsePdf = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return cleanText(data.text);
};

const parseDocx = async (filePath) => {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return cleanText(result.value);
};

export const handleResumeUpload = async (
  file,
  userId
) => {
  const filePath = file.path;

  const fileExtension = path
    .extname(file.originalname)
    .toLowerCase();

  let extractedText = "";

  /*
  STEP 1 → Parse Resume
  */

  if (fileExtension === ".pdf") {
    extractedText = await parsePdf(filePath);
  } else if (fileExtension === ".docx") {
    extractedText = await parseDocx(filePath);
  } else {
    throw new Error(
      "Unsupported file format"
    );
  }

  /*
  STEP 2 → Full AI Resume Analysis
  (Resume Analysis + ATS + Suggestions)
  */

  const aiData = await extractResumeData(
    extractedText
  );

  const skills = aiData.skills || [];

  const experienceLevel =
    aiData.experienceLevel || "";

  const primaryRole =
    aiData.primaryRole || "";

  const secondaryRoles =
    aiData.secondaryRoles || [];

  const summary =
    aiData.summary || "";

  /*
  ATS Analysis
  */

  const atsScore =
    aiData.atsScore || 0;

  const atsIssues =
    aiData.atsIssues || [];

  const atsSuggestions =
    aiData.atsSuggestions || [];

  const atsStrengths =
    aiData.atsStrengths || [];

  /*
  AI Suggestions Engine
  */

  const careerSuggestions =
    aiData.careerSuggestions || [];

  const improvementPlan =
    aiData.improvementPlan || [];

  const interviewTips =
    aiData.interviewTips || [];

  /*
  STEP 3 → Priority-Based Job Search
  */

  const jobs =
    await fetchPriorityJobs(
      primaryRole,
      secondaryRoles
    );

  /*
  STEP 4 → AI Match Score Per Job
  */

  const matchedJobs = [];

  for (const job of jobs) {
    const aiMatch =
      await getAIMatchScore(
        extractedText,
        job.description || ""
      );

    matchedJobs.push({
      ...job,

      matchScore:
        aiMatch.matchScore || 0,

      matchedSkills:
        aiMatch.matchedSkills || [],

      missingSkills:
        aiMatch.missingSkills || [],

      strengthAreas:
        aiMatch.strengthAreas || [],

      weakAreas:
        aiMatch.weakAreas || [],

      recommendation:
        aiMatch.recommendation || "",
    });
  }

  /*
  STEP 5 → Sort Best Matches First
  */

  matchedJobs.sort(
    (a, b) =>
      b.matchScore - a.matchScore
  );

  /*
  STEP 6 → Save Everything
  */

  const savedResume =
    await Resume.create({
      userId: userId,

      fileName: file.filename,
      originalName:
        file.originalname,

      filePath: file.path,

      extractedText,

      skills,
      experienceLevel,

      primaryRole,
      secondaryRoles,

      summary,

      matchedJobs,

      atsScore,
      atsIssues,
      atsSuggestions,
      atsStrengths,

      careerSuggestions,
      improvementPlan,
      interviewTips,
    });

  /*
  STEP 7 → Final Response
  */

  return {
    fileName: file.filename,
    originalName:
      file.originalname,

    filePath: file.path,

    extractedText,

    skills,
    experienceLevel,

    primaryRole,
    secondaryRoles,

    summary,

    matchedJobs,

    atsScore,
    atsIssues,
    atsSuggestions,
    atsStrengths,

    careerSuggestions,
    improvementPlan,
    interviewTips,

    savedResume,
  };
};