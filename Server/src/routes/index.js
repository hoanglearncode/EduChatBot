import express from "express";
import apiRoutes from "./api.js";
import chatRoutes from "./chat.js";

const router = express.Router();

// API routes
router.use("/api", apiRoutes);

// Chat routes
router.use("/", chatRoutes);

export default router;