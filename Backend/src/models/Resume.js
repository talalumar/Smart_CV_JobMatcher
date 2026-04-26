import mongoose from "mongoose";

const matchedJobSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        default: "",
      },

      employer: {
        type: String,
        default: "",
      },

      location: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "",
      },

      applyLink: {
        type: String,
        default: "",
      },

      employmentType: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      /*
      AI Match Score Fields
      */

      matchScore: {
        type: Number,
        default: 0,
      },

      matchedSkills: {
        type: [String],
        default: [],
      },

      missingSkills: {
        type: [String],
        default: [],
      },

      strengthAreas: {
        type: [String],
        default: [],
      },

      weakAreas: {
        type: [String],
        default: [],
      },

      recommendation: {
        type: String,
        default: "",
      },
    },
    {
      _id: true,
    }
  );

const resumeSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      fileName: {
        type: String,
        required: true,
      },

      originalName: {
        type: String,
        required: true,
      },

      filePath: {
        type: String,
        required: true,
      },

      extractedText: {
        type: String,
        default: "",
      },

      /*
      Resume Intelligence
      */

      skills: {
        type: [String],
        default: [],
      },

      experienceLevel: {
        type: String,
        default: "",
      },

      primaryRole: {
        type: String,
        default: "",
      },

      secondaryRoles: {
        type: [String],
        default: [],
      },

      summary: {
        type: String,
        default: "",
      },

      /*
      Smart Job Matching
      */

      matchedJobs: {
        type: [matchedJobSchema],
        default: [],
      },

      /*
      ATS Score Engine
      */

      atsScore: {
        type: Number,
        default: 0,
      },

      atsIssues: {
        type: [String],
        default: [],
      },

      atsSuggestions: {
        type: [String],
        default: [],
      },

      atsStrengths: {
        type: [String],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

const Resume =
  mongoose.model(
    "Resume",
    resumeSchema
  );

export default Resume;