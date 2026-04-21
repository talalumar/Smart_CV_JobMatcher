const skillsList = require("../constants/skills.constant");

const extractSkills = (resumeText) => {
  const foundSkills = [];

  const lowerCaseText = resumeText.toLowerCase();

  skillsList.forEach((skill) => {
    if (
      lowerCaseText.includes(skill.toLowerCase())
    ) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)];
};

module.exports = extractSkills;