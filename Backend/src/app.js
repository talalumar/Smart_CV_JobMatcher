import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resume.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/api/resume", resumeRoutes);
app.use("/api/auth", authRoutes);

export default app;