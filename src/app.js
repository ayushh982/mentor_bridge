import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import videoRoutes from "./routes/video.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser());


//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/mentors", mentorRoutes);
app.use("/api/v1/bookings",bookingRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/video", videoRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use(errorHandler);

export default app;