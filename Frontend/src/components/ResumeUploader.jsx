"use client";

import { useState } from "react";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import useResumeStore from "@/store/resumeStore";

export default function ResumeUploader() {
  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const {
    setResumeData,
  } = useResumeStore();

  const { token } = useAuth();

  const handleUpload =
    async () => {
      if (!file) {
        alert(
          "Please select a resume"
        );
        return;
      }

      const authToken =
        token ||
        localStorage.getItem(
          "token"
        );

      if (!authToken) {
        alert(
          "You are not logged in. Please login first."
        );
        return;
      }

      try {
        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          file
        );

        const res =
          await API.post(
            "/resume/upload",
            formData,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setResumeData(
          res.data.data
        );

        alert(
          "Resume uploaded successfully"
        );

        console.log(
          "Resume Upload Response:",
          res.data
        );
      } catch (error) {
        console.log(error);
        alert(
          "Upload failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Upload Your Resume
        </h2>

        <p className="text-gray-500 mt-2">
          Upload your CV and let AI
          analyze your ATS score,
          matched jobs, and career
          suggestions instantly.
        </p>
      </div>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-all duration-300">
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700">
            Drag & Drop your Resume
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Supported formats:
            PDF, DOC, DOCX
          </p>
        </div>

        <label className="inline-block cursor-pointer">
          <span className="bg-gray-100 hover:bg-gray-200 transition px-6 py-3 rounded-xl font-medium text-gray-700">
            Choose File
          </span>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />
        </label>

        {file && (
          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-blue-700">
              Selected File:
            </p>

            <p className="text-gray-700 mt-1">
              {file.name}
            </p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold py-4 rounded-2xl shadow-md text-lg"
      >
        {loading
          ? "Analyzing Resume..."
          : "Upload & Analyze Resume"}
      </button>
    </div>
  );
}