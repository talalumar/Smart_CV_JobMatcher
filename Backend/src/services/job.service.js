import axios from "axios";

const fetchSingleQueryJobs = async (query) => {
  try {
    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",

      params: {
        query: `${query} remote jobs`,
        page: "1",
        num_pages: "1",
      },

      headers: {
        "X-RapidAPI-Key":
          process.env.RAPIDAPI_KEY,

        "X-RapidAPI-Host":
          process.env.RAPIDAPI_HOST,
      },
    };

    const response =
      await axios.request(options);

    return response.data.data || [];
  } catch (error) {
    console.error(
      "Fetch Jobs Error:",
      error.response?.data ||
        error.message
    );

    return [];
  }
};

export const fetchPriorityJobs = async (
  primaryRole,
  secondaryRoles
) => {
  let jobs = [];

  console.log(
    "Primary Role:",
    primaryRole
  );

  jobs = await fetchSingleQueryJobs(
    primaryRole
  );

  if (jobs.length < 5) {
    for (const role of secondaryRoles) {
      const extraJobs =
        await fetchSingleQueryJobs(role);

      jobs = [...jobs, ...extraJobs];

      if (jobs.length >= 10) break;
    }
  }

  const uniqueJobs = jobs.filter(
    (job, index, self) =>
      index ===
      self.findIndex(
        (j) =>
          j.job_title === job.job_title
      )
  );

  return uniqueJobs.map((job) => ({
    title: job.job_title,
    employer: job.employer_name,
    location:
      job.job_city || "Remote",
    country:
      job.job_country || "",
    applyLink:
      job.job_apply_link,
    employmentType:
      job.job_employment_type,
    description:
      job.job_description,
  }));
};