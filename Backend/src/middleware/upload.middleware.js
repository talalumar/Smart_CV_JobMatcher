import multer from "multer";
import path from "path";

// Use memory storage - file available as buffer, no disk or Cloudinary download needed
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;