"use client";

import useResumeStore from "@/store/resumeStore";

export default function ATSCard() {
  const { resumeData } = useResumeStore();

  const score = resumeData?.atsScore || 0;
  const strengths = resumeData?.atsStrengths || [];
  const issues = resumeData?.atsIssues || [];
  const suggestions = resumeData?.atsSuggestions || [];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        ATS Score Analysis
      </h2>

      <div className="mb-6">
        <p className="text-5xl font-bold">
          {score}/100
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg">
            Strengths
          </h3>

          <ul className="list-disc pl-6">
            {strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            Issues
          </h3>

          <ul className="list-disc pl-6">
            {issues.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            Suggestions
          </h3>

          <ul className="list-disc pl-6">
            {suggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}