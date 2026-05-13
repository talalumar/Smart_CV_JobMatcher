import * as resumeParserService from "../services/resumeParser.service.js";
import Resume from "../models/Resume.js";
import { handleResumeUpload } from "../services/resumeParser.service.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Respond immediately
    res.status(200).json({
      success: true,
      message: "Resume uploaded. Analysis in progress...",
    });

    // Process in background
    // Process in background after response is sent
handleResumeUpload(req.file, req.user.id)
  .then(() => {
    console.log("Background processing COMPLETE for user:", req.user.id);
  })
  .catch((err) => {
    console.error("Background processing FAILED:", err.message);
    console.error("Full error:", err);
  });

  } catch (err) {
    console.error("Resume upload error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


export const getUserResumes = async (req, res) => {
  try {
    const userId = req.user.id;

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .select("_id originalName createdAt");

    return res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};