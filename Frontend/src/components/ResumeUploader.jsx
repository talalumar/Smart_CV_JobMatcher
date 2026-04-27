"use client";

import { useState } from "react";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import useResumeStore from "@/store/resumeStore";

export default function ResumeUploader() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setResumeData } = useResumeStore();
    const { token } = useAuth();

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a resume");
            return;
        }

        // Read directly from localStorage as fallback
        const authToken = token || localStorage.getItem("token");

        if (!authToken) {
            alert("You are not logged in. Please login first.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("resume", file);

            const res = await API.post("/resume/upload", formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setResumeData(res.data.data);
            alert("Resume uploaded successfully");
            console.log("Resume Upload Response:", res.data);

        } catch (error) {
            console.log(error);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">
                Upload Resume
            </h2>

            <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                    setFile(e.target.files[0])
                }
            />

            <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-4 bg-black text-white px-6 py-2 rounded"
            >
                {loading ? "Uploading..." : "Upload Resume"}
            </button>
        </div>
    );
}