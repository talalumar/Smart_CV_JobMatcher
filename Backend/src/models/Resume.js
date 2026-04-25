import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
     type: mongoose.Schema.Types.ObjectId,
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
      required: true,
    },

    skills: [
      {
        type: String,
      },
    ],

    experienceLevel: String,
    jobRoles: [String],
    summary: String,

    matchedJobs: [
      {
        title: String,
        employer: String,
        location: String,
        country: String,
        applyLink: String,
        employmentType: String,
        description: String,
        matchScore: Number,
        matchedSkills: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model(
  "Resume",
  resumeSchema
);

export default Resume;