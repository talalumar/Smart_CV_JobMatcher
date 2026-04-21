exports.calculateMatchScore = (
  resumeSkills,
  jobs
) => {
  const scoredJobs = jobs.map((job) => {
    const jobText = (
      job.title +
      " " +
      job.description
    ).toLowerCase();

    let matchedSkills = [];

    resumeSkills.forEach((skill) => {
      if (
        jobText.includes(skill.toLowerCase())
      ) {
        matchedSkills.push(skill);
      }
    });

    const uniqueMatchedSkills = [
      ...new Set(matchedSkills),
    ];

    const score =
      resumeSkills.length > 0
        ? Math.round(
            (uniqueMatchedSkills.length /
              resumeSkills.length) *
              100
          )
        : 0;

    return {
      ...job,
      matchScore: score,
      matchedSkills: uniqueMatchedSkills,
    };
  });

  return scoredJobs.sort(
    (a, b) => b.matchScore - a.matchScore
  );
};