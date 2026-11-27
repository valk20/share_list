import express from "express";
import { testConnection } from "../config/db.js";

const router = express.Router();

router.get("/health", async (_req, res) => {
  await testConnection();
  res.status(200).json({ status: "OK" });
});

export default router;
