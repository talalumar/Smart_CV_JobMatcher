"use client";

import useResumeStore from "@/store/resumeStore";

export default function JobCard() {
  const { resumeData } = useResumeStore();

  const jobs = resumeData?.matchedJobs || [];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6">
        Top Matched Jobs
      </h2>

      <div className="space-y-6">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div
              key={index}
              className="border rounded-lg p-5"
            >
              <h3 className="text-xl font-bold">
                {job.title}
              </h3>

              <p className="mt-2">
                Match Score:
                <span className="font-bold">
                  {" "}
                  {job.matchScore}%
                </span>
              </p>

              <p className="mt-2">
                Employer: {job.employer}
              </p>

              <p className="mt-2">
                Location: {job.location}
              </p>

              <div className="mt-4">
                <h4 className="font-semibold">
                  Missing Skills
                </h4>

                <ul className="list-disc pl-6">
                  {(job.missingSkills || []).map(
                    (skill, i) => (
                      <li key={i}>
                        {skill}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold">
                  Recommendation
                </h4>

                <p>
                  {job.recommendation}
                </p>
              </div>

              <a
                href={job.applyLink}
                target="_blank"
                className="inline-block mt-4 bg-black text-white px-5 py-2 rounded"
              >
                Apply Now
              </a>
            </div>
          ))
        ) : (
          <p>No matched jobs found</p>
        )}
      </div>
    </div>
  );
}