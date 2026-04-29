import Resume from "../models/Resume.js";
import {
  generateInterviewQuestions,
} from "../services/interview.service.js";
import {
  evaluateAnswer,
} from "../services/answerEvaluation.service.js";

/*
========================================
1. Generate Personalized Interview Questions
========================================
*/

export const getInterviewQuestions =
  async (req, res) => {
    try {
      const userId = req.user.id;

      const latestResume =
        await Resume.findOne({
          userId,
        }).sort({
          createdAt: -1,
        });

      if (!latestResume) {
        return res.status(404).json({
          success: false,
          message:
            "No resume found. Please upload resume first.",
        });
      }

      const questionsData =
        await generateInterviewQuestions(
          latestResume.primaryRole,
          latestResume.secondaryRoles,
          latestResume.skills,
          latestResume.experienceLevel,
          latestResume.atsIssues,
          latestResume.matchedJobs
        );

      return res.status(200).json({
        success: true,
        message:
          "Interview questions generated successfully",
        data: questionsData,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to generate interview questions",
      });
    }
  };

/*
========================================
2. Evaluate Interview Answer
========================================
*/

export const submitInterviewAnswer =
  async (req, res) => {
    try {
      const {
        question,
        idealAnswer,
        userAnswer,
      } = req.body;

      if (
        !question ||
        !idealAnswer ||
        !userAnswer
      ) {
        return res.status(400).json({
          success: false,
          message:
            "question, idealAnswer, and userAnswer are required",
        });
      }

      const evaluation =
        await evaluateAnswer(
          question,
          idealAnswer,
          userAnswer
        );

      return res.status(200).json({
        success: true,
        message:
          "Answer evaluated successfully",
        data: evaluation,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to evaluate answer",
      });
    }
  };