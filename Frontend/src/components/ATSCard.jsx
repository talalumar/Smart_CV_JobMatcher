"use client";

import useResumeStore from "@/store/resumeStore";

export default function ATSCard() {
  const { resumeData } = useResumeStore();

  const score = resumeData?.atsScore || 0;
  const strengths =
    resumeData?.atsStrengths || [];
  const issues =
    resumeData?.atsIssues || [];
  const suggestions =
    resumeData?.atsSuggestions || [];

  const getScoreColor = () => {
    if (score >= 80)
      return "text-green-600";
    if (score >= 60)
      return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = () => {
    if (score >= 80)
      return "Excellent";
    if (score >= 60)
      return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          ATS Score Analysis
        </h2>

        <p className="text-gray-500 mt-1">
          AI-powered resume screening
          report
        </p>
      </div>

      {/* Score Section */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Overall ATS Score
        </p>

        <h1
          className={`text-6xl font-bold ${getScoreColor()}`}
        >
          {score}
          <span className="text-2xl text-gray-400">
            /100
          </span>
        </h1>

        <p
          className={`mt-3 font-semibold ${getScoreColor()}`}
        >
          {getScoreLabel()}
        </p>
      </div>

      {/* Strengths */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-green-700 mb-3">
          Strengths
        </h3>

        <div className="space-y-2">
          {strengths.map(
            (item, index) => (
              <div
                key={index}
                className="bg-green-50 border border-green-100 rounded-lg px-4 py-3"
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>

      {/* Issues */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-red-700 mb-3">
          Issues
        </h3>

        <div className="space-y-2">
          {issues.map(
            (item, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-100 rounded-lg px-4 py-3"
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <h3 className="text-lg font-semibold text-blue-700 mb-3">
          Suggestions
        </h3>

        <div className="space-y-2">
          {suggestions.map(
            (item, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3"
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}