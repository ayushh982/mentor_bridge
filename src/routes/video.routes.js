import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getMeetingDetails } from "../controllers/video.controller.js";

const router = Router();

router.get(
    "/:bookingId",
    verifyJWT,
    getMeetingDetails
);

export default router;