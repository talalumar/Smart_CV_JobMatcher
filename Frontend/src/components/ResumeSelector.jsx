"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

export default function ResumeSelector({
  selectedResume,
  setSelectedResume,
}) {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      const res = await API.get("/resume/my");
      setResumes(res.data.data);
    };

    fetchResumes();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Select Resume
      </h2>

      <select
        value={selectedResume}
        onChange={(e) =>
          setSelectedResume(e.target.value)
        }
        className="w-full border p-3 rounded-lg"
      >
        <option value="">
          Select Resume
        </option>

        {resumes.map((resume) => (
          <option
            key={resume._id}
            value={resume._id}
          >
            {resume.originalName}
          </option>
        ))}
      </select>
    </div>
  );
}