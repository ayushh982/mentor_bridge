import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import {
    bookSession,
    getMyBookings,
    cancelBooking,
    rescheduleBooking,
} from "../controllers/booking.controller.js";

const router = Router();

router.post("/", verifyJWT, bookSession);

router.get("/my-bookings", verifyJWT, getMyBookings);

router.patch("/:id/cancel", verifyJWT, cancelBooking);

router.patch("/:id/reschedule", verifyJWT, rescheduleBooking);

export default router;