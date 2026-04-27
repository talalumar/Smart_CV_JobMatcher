"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import Sidebar from "@/components/Sidebar";
import ResumeUploader from "@/components/ResumeUploader";
import ATSCard from "@/components/ATSCard";
import JobCard from "@/components/JobCard";
import SuggestionCard from "@/components/SuggestionCard";

export default function Dashboard() {
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token, router]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 p-8 bg-gray-100">
                <h1 className="text-3xl font-bold mb-8">
                    Smart CV Job Matcher
                </h1>

                <ResumeUploader />

                <div className="mt-8">
                    <ATSCard />
                </div>

                <div className="mt-8">
                    <JobCard />
                </div>
            </main>
        </div>
    );
}