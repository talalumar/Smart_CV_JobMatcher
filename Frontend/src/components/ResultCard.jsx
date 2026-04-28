"use client";

import useResumeStore from "@/store/resumeStore";

export default function ResultCard() {
  const { resumeData } =
    useResumeStore();

  if (!resumeData) return null;

  const {
    skills = [],
    primaryRole = "",
    secondaryRoles = [],
    summary = "",
    matchedJobs = [],
  } = resumeData;

  const getScoreColor = (
    score
  ) => {
    if (score >= 80)
      return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mt-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Resume Analysis &
          Matched Jobs
        </h2>

        <p className="text-gray-500 mt-2">
          AI-powered analysis of
          your resume and best job
          opportunities based on
          your profile.
        </p>
      </div>

      {/* Resume Analysis Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Resume Analysis
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary Role */}
          <div className="bg-gray-50 rounded-2xl p-5 border">
            <p className="text-sm text-gray-500 mb-2">
              Primary Role
            </p>

            <h4 className="text-lg font-semibold text-gray-800">
              {primaryRole || "N/A"}
            </h4>
          </div>

          {/* Secondary Roles */}
          <div className="bg-gray-50 rounded-2xl p-5 border">
            <p className="text-sm text-gray-500 mb-2">
              Secondary Roles
            </p>

            <h4 className="text-lg font-semibold text-gray-800">
              {secondaryRoles.length >
              0
                ? secondaryRoles.join(
                    ", "
                  )
                : "N/A"}
            </h4>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-5 border mt-6">
          <p className="text-sm text-gray-500 mb-2">
            Professional Summary
          </p>

          <p className="text-gray-700 leading-relaxed">
            {summary || "N/A"}
          </p>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <p className="font-semibold text-lg mb-4">
            Skills
          </p>

          <div className="flex flex-wrap gap-3">
            {skills.map(
              (skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Matched Jobs Section */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Matched Jobs
        </h3>

        {matchedJobs.length ===
        0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border">
            <p className="text-gray-500 text-lg">
              No matched jobs found
              yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {matchedJobs.map(
              (job, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Job Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">
                        {job.title}
                      </h4>

                      <p className="text-gray-500 mt-1">
                        {
                          job.employer
                        }{" "}
                        •{" "}
                        {
                          job.location
                        }
                      </p>
                    </div>

                    <div
                      className={`px-5 py-3 rounded-2xl border font-bold text-lg ${getScoreColor(
                        job.matchScore ||
                          0
                      )}`}
                    >
                      {
                        job.matchScore
                      }
                      % Match
                    </div>
                  </div>

                  {/* Matched Skills */}
                  <div className="mt-6">
                    <p className="font-semibold mb-3">
                      Matched Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(
                        job.matchedSkills ||
                        []
                      ).map(
                        (
                          skill,
                          i
                        ) => (
                          <span
                            key={i}
                            className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="mt-6">
                    <p className="font-semibold mb-3">
                      Missing Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(
                        job.missingSkills ||
                        []
                      ).map(
                        (
                          skill,
                          i
                        ) => (
                          <span
                            key={i}
                            className="bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mt-6 bg-gray-50 rounded-2xl p-5 border">
                    <p className="font-semibold mb-2">
                      AI Recommendation
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                      {job.recommendation ||
                        "No recommendation available"}
                    </p>
                  </div>

                  {/* Apply Button */}
                  <a
                    href={
                      job.applyLink
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold px-6 py-3 rounded-2xl shadow-md"
                  >
                    Apply Now
                  </a>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}