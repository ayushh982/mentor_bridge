import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import {
    createMentorProfile,
    updateMentorProfile,
    getMentorProfile,
    getAllMentors,
} from "../controllers/mentor.controller.js";

const router = Router();

router.post("/", verifyJWT, createMentorProfile);

router.patch("/", verifyJWT, updateMentorProfile);

router.get("/", getAllMentors);

router.get("/:id", getMentorProfile);

export default router;