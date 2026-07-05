import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import {
    createReview,
    getMentorReviews,
    deleteReview,
} from "../controllers/review.controller.js";

const router = Router();

router.post("/", verifyJWT, createReview);

router.get("/:mentorId", getMentorReviews);

router.delete("/:id", verifyJWT, deleteReview);

export default router;