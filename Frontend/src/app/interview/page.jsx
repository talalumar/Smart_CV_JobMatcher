"use client";

import { useEffect } from "react";
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
    currentQuestion,
    evaluation,
    loading,
    setQuestions,
    setLoading,
    resetInterview,
  } = useInterviewStore();

  /*
  ========================================
  Load Interview Questions
  ========================================
  */

  const loadQuestions = async () => {
    try {
      const authToken =
        token ||
        localStorage.getItem("token");

      if (!authToken) {
        alert(
          "Please login first"
        );
        router.push("/login");
        return;
      }

      setLoading(true);

      const res = await API.get(
        "/interview/questions",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setQuestions(res.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Failed to load interview questions"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  First Load
  ========================================
  */

  useEffect(() => {
    loadQuestions();

    return () => {
      resetInterview();
    };
  }, []);

  /*
  ========================================
  UI
  ========================================
  */

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              AI Mock Interview
            </h1>

            <p className="text-gray-600 mt-2">
              Personalized interview
              questions powered by AI
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-lg font-medium">
              Generating interview
              questions...
            </p>
          </div>
        ) : !questions ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p>
              No interview questions
              available
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <InterviewCard />

            {evaluation && (
              <EvaluationCard />
            )}
          </div>
        )}
      </div>
    </div>
  );
}