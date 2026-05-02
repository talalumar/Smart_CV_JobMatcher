"use client";

import { useState } from "react";
import useInterviewStore from "@/store/interviewStore";
import API from "@/services/api";

export default function InterviewCard() {
  const {
    questions,
    setEvaluation,
  } = useInterviewStore();

  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  if (!questions) return null;

  const handleChange = (q, value) => {
    setAnswers((prev) => ({
      ...prev,
      [q]: value,
    }));
  };

  const handleSubmit = async () => {
  // Get all questions from all sections
  const allQuestions = [
    ...(questions.technicalQuestions || []),
    ...(questions.projectQuestions || []),
    ...(questions.hrQuestions || []),
    ...(questions.weakAreaQuestions || []),
    ...(questions.roleSpecificQuestions || []),
  ];

  // Check if all questions are answered
  const unanswered = allQuestions.filter(
    (q) => !answers[q] || answers[q].trim() === ""
  );

  if (unanswered.length > 0) {
    alert(`Please answer all questions before submitting. ${unanswered.length} question(s) remaining.`);
    return;
  }

  try {
    setLoading(true);
    const res = await API.post("/interview/evaluate-full", { answers });
    setEvaluation(res.data.data);
  } catch (error) {
    console.log("Error:", error.response?.data);
    alert("Evaluation failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const renderSection = (title, list) => {
    if (!list || list.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {title}
        </h3>

        <div className="space-y-5">
          {list.map((q, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg border"
            >
              <p className="font-medium mb-2">
                {index + 1}. {q}
              </p>

              <textarea
                placeholder="Write your answer..."
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                rows={3}
                onChange={(e) =>
                  handleChange(q, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6">
        AI Interview Questions
      </h2>

      {renderSection(
        "Technical Questions",
        questions.technicalQuestions
      )}

      {renderSection(
        "Project Questions",
        questions.projectQuestions
      )}

      {renderSection(
        "HR Questions",
        questions.hrQuestions
      )}

      {renderSection(
        "Weak Area Questions",
        questions.weakAreaQuestions
      )}

      {renderSection(
        "Role-Specific Questions",
        questions.roleSpecificQuestions
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl mt-4 hover:bg-gray-800 transition"
      >
        {loading
          ? "Evaluating..."
          : "Submit Answers & Get Feedback"}
      </button>
    </div>
  );
}