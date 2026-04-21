const resumeParserService = require(
  "../services/resumeParser.service"
);

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result =
      await resumeParserService.handleResumeUpload(
        req.file
      );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};