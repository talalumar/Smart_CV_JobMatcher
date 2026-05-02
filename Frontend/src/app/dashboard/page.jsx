"use client";

import Link from "next/link";

import ResumeUploader from "@/components/ResumeUploader";
import ATSCard from "@/components/ATSCard";
import ResultCard from "@/components/ResultCard";
import SuggestionCard from "@/components/SuggestionCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Smart CV Job Matcher
              </h1>

              <p className="text-gray-500 mt-2 text-lg max-w-3xl">
                Upload your resume, get ATS analysis,
                AI-powered job matching, personalized
                suggestions, and practice with dynamic
                AI-powered interview preparation.
              </p>
            </div>

            {/* Interview Button */}
            <Link href="/interview">
              <button className="bg-black text-white px-7 py-3 rounded-xl font-semibold hover:bg-gray-800 transition duration-300 shadow-md">
                Start AI Interview
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Resume Upload Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Upload Resume
          </h2>

          <ResumeUploader />
        </div>

        {/* ATS + Suggestions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <ATSCard />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <SuggestionCard />
          </div>
        </div>

        {/* Matched Jobs Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Resume Analysis & Matched Jobs
          </h2>

          <ResultCard />
        </div>
      </div>
    </div>
  );
}