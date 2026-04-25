import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Resume from "../models/Resume.js";
import mammoth from "mammoth";
import { calculateMatchScore } from "./jobMatcher.service.js";
import { fetchJobs } from "./jobFetcher.service.js";
import { extractResumeData } from "./gemini.service.js";

const cleanText = (text) => {
  return text.replace(/\s+/g, " ").trim();
};

const parsePdf = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return cleanText(data.text);
};

const parseDocx = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return cleanText(result.value);
};

export const handleResumeUpload = async (file, userId) => {
  const filePath = file.path;
  const fileExtension = path.extname(file.originalname).toLowerCase();

  let extractedText = "";

  if (fileExtension === ".pdf") {
    extractedText = await parsePdf(filePath);
  } else if (fileExtension === ".docx") {
    extractedText = await parseDocx(filePath);
  } else {
    throw new Error("Unsupported file format");
  }

  // ✅ Call directly — no service prefix
  const aiData = await extractResumeData(extractedText);

  const skills = aiData.skills || [];
  const experienceLevel = aiData.experienceLevel || "";
  const jobRoles = aiData.jobRoles || [];
  const summary = aiData.summary || "";

  // ✅ Call directly — no service prefix
  const jobs = await fetchJobs(skills);
  const matchedJobs = calculateMatchScore(skills, jobs);

  const savedResume = await Resume.create({
    userId,
    fileName: file.filename,
    originalName: file.originalname,
    filePath: file.path,
    extractedText,
    skills,
    matchedJobs,
  });

  return {
    fileName: file.filename,
    originalName: file.originalname,
    filePath: file.path,
    extractedText,
    skills,
    experienceLevel,
    jobRoles,
    summary,
    matchedJobs,
    savedResume,
  };
};