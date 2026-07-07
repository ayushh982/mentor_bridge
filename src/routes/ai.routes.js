import { Router } from "express";
import { chatWithAI } from "../controllers/ai.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.post("/chat", verifyJWT, chatWithAI);

export default router;