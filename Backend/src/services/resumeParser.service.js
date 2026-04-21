exports.handleResumeUpload = async (file) => {
  return {
    fileName: file.filename,
    originalName: file.originalname,
    filePath: file.path,
    fileSize: file.size,
    mimeType: file.mimetype,
  };
};