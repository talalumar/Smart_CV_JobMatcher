import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getInterviewQuestions,
  submitInterviewAnswer,
} from "../controllers/interview.controller.js";

const router = express.Router();

/*
========================================
1. Generate Personalized Interview Questions
========================================
GET /api/interview/questions
========================================
*/

router.get(
  "/questions",
  authMiddleware,
  getInterviewQuestions
);

/*
========================================
2. Submit Interview Answer + Get Score
========================================
POST /api/interview/evaluate
========================================
*/

router.post(
  "/evaluate",
  authMiddleware,
  submitInterviewAnswer
);

export default router;