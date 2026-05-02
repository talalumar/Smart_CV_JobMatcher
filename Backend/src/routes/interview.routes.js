import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getInterviewQuestions,
  submitInterviewAnswer,
  submitFullInterview,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.get("/questions", authMiddleware, getInterviewQuestions);
router.post("/evaluate", authMiddleware, submitInterviewAnswer);

// ✅ New bulk evaluation route
router.post("/evaluate-full", authMiddleware, submitFullInterview);

export default router;