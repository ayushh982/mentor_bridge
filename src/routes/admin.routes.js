import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import {
    getPendingMentors,
    approveMentor,
    rejectMentor,
    getAllUsers,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/pending-mentors", verifyJWT, getPendingMentors);

router.patch("/approve/:id", verifyJWT, approveMentor);

router.patch("/reject/:id", verifyJWT, rejectMentor);

router.get("/users", verifyJWT, getAllUsers);

export default router;