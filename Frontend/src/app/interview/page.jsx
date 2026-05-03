"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";

import useInterviewStore from "@/store/interviewStore";

import InterviewCard from "@/components/InterviewCard";
import EvaluationCard from "@/components/EvaluationCard";

export default function InterviewPage() {
  const router = useRouter();
  const { token } = useAuth();

  const {
    questions,
    evaluation,
    loading,
    setQuestions,
    setLoading,
    resetInterview,
  } = useInterviewStore();

  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [resumeLoading, setResumeLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  ========================================
  Fetch Resumes
  ========================================
  */

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const authToken =
          token || localStorage.getItem("token");

        if (!authToken) {
          router.push("/login");
          return;
        }

        setResumeLoading(true);

        const res = await API.get("/resume/user", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = res.data.data || [];

        setResumes(data);

        // Auto select latest
        if (data.length > 0) {
          setSelectedResume(data[0]._id);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load resumes");
      } finally {
        setResumeLoading(false);
      }
    };

    fetchResumes();

    return () => {
      resetInterview();
    };
  }, []);

  /*
  ========================================
  Load Questions
  ========================================
  */

  const loadQuestions = async () => {
    try {
      const authToken =
        token || localStorage.getItem("token");

      if (!selectedResume) {
        alert("Please select a resume");
        return;
      }

      setLoading(true);

      const res = await API.post(
        "/interview/questions",
        { resumeId: selectedResume },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setQuestions(res.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load interview questions");
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  UI
  ========================================
  */

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              AI Mock Interview
            </h1>

            <p className="text-gray-600 mt-2">
              Personalized interview questions powered by AI
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Back
          </button>
        </div>

        {/* Resume Selector */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Select Resume
          </h2>

          {resumeLoading ? (
            <p className="text-gray-500">
              Loading resumes...
            </p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : resumes.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">
                No resumes found
              </p>

              <button
                onClick={() =>
                  router.push("/dashboard")
                }
                className="bg-black text-white px-5 py-2 rounded-lg"
              >
                Upload Resume
              </button>
            </div>
          ) : (
            <>
              <select
                value={selectedResume}
                onChange={(e) =>
                  setSelectedResume(e.target.value)
                }
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                {resumes.map((resume) => (
                  <option
                    key={resume._id}
                    value={resume._id}
                  >
                    {resume.originalName}
                  </option>
                ))}
              </select>

              <button
                onClick={loadQuestions}
                disabled={!selectedResume}
                className="mt-4 bg-black text-white px-6 py-3 rounded-xl w-full font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                Start Interview
              </button>
            </>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-lg font-medium">
              Generating interview...
            </p>
          </div>
        ) : !questions ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
            Click "Start Interview"
          </div>
        ) : (
          <div className="space-y-8">
            <InterviewCard />

            {evaluation && <EvaluationCard />}
          </div>
        )}
      </div>
    </div>
  );
}