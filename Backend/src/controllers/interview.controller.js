import Resume from "../models/Resume.js";
import { generateInterviewQuestions } from "../services/interview.service.js";
import { evaluateAnswer, evaluateFullInterview } from "../services/answerEvaluation.service.js";

export const getInterviewQuestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resumeId } = req.body;

    /*
    STEP 1 → Validate input
    */

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId is required",
      });
    }

    /*
    STEP 2 → Check resume belongs to user (IMPORTANT SECURITY)
    */

    const resume = await Resume.findOne({
      _id: resumeId,
      userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    /*
    STEP 3 → Generate Interview Questions
    */

    const questionsData =
      await generateInterviewQuestions(resumeId);

    return res.status(200).json({
      success: true,
      message: "Interview questions generated successfully",
      data: questionsData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate interview questions",
    });
  }
};

export const submitInterviewAnswer = async (req, res) => {
  try {
    const { question, idealAnswer, userAnswer } = req.body;

    if (!question || !idealAnswer || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: "question, idealAnswer, and userAnswer are required",
      });
    }

    const evaluation = await evaluateAnswer(question, idealAnswer, userAnswer);

    return res.status(200).json({
      success: true,
      message: "Answer evaluated successfully",
      data: evaluation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate answer",
    });
  }
};

// ✅ New bulk evaluation handler
export const submitFullInterview = async (req, res) => {
  try {
    const { answers } = req.body; // { "question text": "user answer", ... }

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No answers provided",
      });
    }

    // Convert { question: answer } object into array format
    const answersArray = Object.entries(answers).map(([question, userAnswer]) => ({
      question,
      idealAnswer: "N/A", // AI will evaluate based on question context
      userAnswer: userAnswer || "No answer provided",
    }));

    const evaluation = await evaluateFullInterview(answersArray);

    return res.status(200).json({
      success: true,
      message: "Interview evaluated successfully",
      data: evaluation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate interview",
    });
  }
};