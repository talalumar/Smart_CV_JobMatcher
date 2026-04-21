const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const extractSkills = require(
  "../utils/skillExtractor"
);
const jobFetcherService = require(
  "./jobFetcher.service"
);
const jobMatcherService = require(
  "./jobMatcher.service"
);

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

exports.handleResumeUpload = async (file) => {
  const filePath = file.path;

  const fileExtension = path
    .extname(file.originalname)
    .toLowerCase();

  let extractedText = "";

  if (fileExtension === ".pdf") {
    extractedText = await parsePdf(filePath);
  } else if (fileExtension === ".docx") {
    extractedText = await parseDocx(filePath);
  } else {
    throw new Error("Unsupported file format");
  }

  const skills = extractSkills(extractedText);

  const jobs = await jobFetcherService.fetchJobs(
  skills
);

const matchedJobs =
  jobMatcherService.calculateMatchScore(
    skills,
    jobs
  );

  return {
  fileName: file.filename,
  originalName: file.originalname,
  filePath: file.path,
  extractedText,
  skills,
  matchedJobs,
};
};