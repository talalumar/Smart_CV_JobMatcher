import mongoose from "mongoose";

const interviewSessionSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      question: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        default: "",
      },

      difficulty: {
        type: String,
        default: "",
      },

      idealAnswer: {
        type: String,
        default: "",
      },

      userAnswer: {
        type: String,
        default: "",
      },

      score: {
        type: Number,
        default: 0,
      },

      feedback: {
        type: String,
        default: "",
      },

      improvement: {
        type: String,
        default: "",
      },

      correctAnswer: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "pending",
          "answered",
        ],
        default: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

const InterviewSession =
  mongoose.model(
    "InterviewSession",
    interviewSessionSchema
  );

export default InterviewSession;