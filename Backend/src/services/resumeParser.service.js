import path from "path";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

import Resume from "../models/Resume.js";
import { fetchPriorityJobs } from "./jobFetcher.service.js";
import { extractResumeData } from "./gemini.service.js";
import { getAIMatchScore } from "./aiMatchScore.service.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cleanText = (text) => {
  return text.replace(/\s+/g, " ").trim();
};

// Upload buffer to Cloudinary and return secure URL
const uploadToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "resumes",
        resource_type: "raw",
        public_id: uniqueName,
        access_mode: "public",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

const parsePdf = async (buffer) => {
  const data = await pdfParse(buffer);
  return cleanText(data.text);
};

const parseDocx = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  return cleanText(result.value);
};

export const handleResumeUpload = async (file, userId) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const buffer = file.buffer; // available because of memoryStorage

  let extractedText = "";

  /*
  STEP 1 → Parse Resume from buffer (no download needed)
  */

  if (fileExtension === ".pdf") {
    extractedText = await parsePdf(buffer);
  } else if (fileExtension === ".docx") {
    extractedText = await parseDocx(buffer);
  } else {
    throw new Error("Unsupported file format");
  }

  /*
  STEP 2 → Upload to Cloudinary (after parsing)
  */

  const fileUrl = await uploadToCloudinary(buffer, file.originalname);

  /*
  STEP 3 → Full AI Resume Analysis
  */

  const aiData = await extractResumeData(extractedText);

  const skills = aiData.skills || [];
  const experienceLevel = aiData.experienceLevel || "";
  const primaryRole = aiData.primaryRole || "";
  const secondaryRoles = aiData.secondaryRoles || [];
  const summary = aiData.summary || "";

  /*
  ATS Analysis
  */

  const atsScore = aiData.atsScore || 0;
  const atsIssues = aiData.atsIssues || [];
  const atsSuggestions = aiData.atsSuggestions || [];
  const atsStrengths = aiData.atsStrengths || [];

  /*
  AI Suggestions Engine
  */

  const careerSuggestions = aiData.careerSuggestions || [];
  const improvementPlan = aiData.improvementPlan || [];
  const interviewTips = aiData.interviewTips || [];

  /*
  STEP 4 → Priority-Based Job Search
  */

  const jobs = await fetchPriorityJobs(primaryRole, secondaryRoles);

  /*
  STEP 5 → AI Match Score Per Job
  */

  const matchedJobs = [];

  for (const job of jobs) {
    const aiMatch = await getAIMatchScore(
      extractedText,
      job.description || ""
    );

    matchedJobs.push({
      ...job,
      matchScore: aiMatch.matchScore || 0,
      matchedSkills: aiMatch.matchedSkills || [],
      missingSkills: aiMatch.missingSkills || [],
      strengthAreas: aiMatch.strengthAreas || [],
      weakAreas: aiMatch.weakAreas || [],
      recommendation: aiMatch.recommendation || "",
    });
  }

  /*
  STEP 6 → Sort Best Matches First
  */

  matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

  /*
  STEP 7 → Save Everything
  */

  const savedResume = await Resume.create({
    userId,
    fileName: file.originalname,
    originalName: file.originalname,
    filePath: fileUrl,
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
  STEP 8 → Final Response
  */

  return {
    fileName: file.originalname,
    originalName: file.originalname,
    filePath: fileUrl,
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