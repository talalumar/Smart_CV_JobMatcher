import axios from "axios";

export const fetchJobs = async (skills) => {
  try {
    const searchQuery = skills.slice(0, 3).join(" ");

    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",
      params: {
        query: `${searchQuery} developer jobs`,
        page: "1",
        num_pages: "1",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    };

    const response = await axios.request(options);

    return response.data.data.map((job) => ({
      title: job.job_title,
      employer: job.employer_name,
      location: job.job_city || "Remote",
      country: job.job_country || "",
      applyLink: job.job_apply_link,
      employmentType: job.job_employment_type,
      description: job.job_description,
    }));
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Failed to fetch jobs");
  }
};