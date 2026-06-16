import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getProfile,
  saveProfile,
  getJobs,
  applyJob,
  getApplications,
<<<<<<< HEAD
  getSkillGapAnalysis
=======
  uploadResume
>>>>>>> 87fe91b630e0ec32e29aec36bef6c38683f6e43a
} from "../controllers/studentController.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Get logged-in student profile
router.get("/profile", verifyToken, getProfile);

// Save/update student profile
router.patch("/profile", verifyToken, saveProfile);

// Get all approved jobs
router.get("/jobs", verifyToken, getJobs);

// Apply for a job
router.post("/apply/:jobId", verifyToken, applyJob);

// Get all applications of this student
router.get("/applications", verifyToken, getApplications);

<<<<<<< HEAD
// AI-powered skill gap analysis for a specific job
router.get("/skill-gap/:jobId", verifyToken, getSkillGapAnalysis);
=======
// Upload resume and parse via AI
router.post("/upload-resume", verifyToken, upload.single("resume"), uploadResume);
>>>>>>> 87fe91b630e0ec32e29aec36bef6c38683f6e43a

export default router;
