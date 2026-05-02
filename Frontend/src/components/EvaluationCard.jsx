"use client";

import useInterviewStore from "@/store/interviewStore";

export default function EvaluationCard() {
  const { evaluation } = useInterviewStore();

  if (!evaluation) return null;

  const {
    overallScore = 0,
    feedback = "",
    improvementAreas = [],
    strongAreas = [],
    evaluatedAnswers = [],
  } = evaluation;

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6">
        Interview Evaluation Report
      </h2>

      {/* Overall Score */}
      <div className="mb-8 border rounded-xl p-6 bg-gray-50">
        <p className="text-sm text-gray-500 mb-2">
          Overall Interview Score
        </p>

        <h3 className="text-5xl font-bold text-black">
          {overallScore}/100
        </h3>

        <p className="mt-4 text-gray-700">
          {feedback || "No feedback available"}
        </p>
      </div>

      {/* Strong Areas */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">
          Strong Areas
        </h3>

        {strongAreas.length === 0 ? (
          <p className="text-gray-500">
            No strong areas found.
          </p>
        ) : (
          <ul className="list-disc pl-6 space-y-2">
            {strongAreas.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Improvement Areas */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">
          Improvement Areas
        </h3>

        {improvementAreas.length === 0 ? (
          <p className="text-gray-500">
            No improvement areas found.
          </p>
        ) : (
          <ul className="list-disc pl-6 space-y-2">
            {improvementAreas.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Per Question Evaluation */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Question-wise Evaluation
        </h3>

        {evaluatedAnswers.length === 0 ? (
          <p className="text-gray-500">
            No evaluated answers found.
          </p>
        ) : (
          <div className="space-y-6">
            {evaluatedAnswers.map(
              (item, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-5"
                >
                  <h4 className="font-semibold text-lg mb-3">
                    Q{index + 1}:{" "}
                    {item.question}
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">
                        Your Answer
                      </p>
                      <p className="text-gray-700">
                        {item.userAnswer ||
                          "No answer provided"}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">
                        Correct Answer
                      </p>
                      <p className="text-gray-700">
                        {item.correctAnswer ||
                          "No correct answer available"}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">
                        Score
                      </p>
                      <p>
                        {item.score || 0}/10
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">
                        Feedback
                      </p>
                      <p className="text-gray-700">
                        {item.feedback ||
                          "No feedback available"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}