import Booking from "../models/Booking.js";
import MentorProfile from "../models/MentorProfile.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { randomUUID } from "crypto";

const bookSession = asyncHandler(async (req, res) => {

    if (req.user.role !== "student") {
        throw new ApiError(403, "Only students can book sessions");
    }

    const {
        mentorId,
        sessionDate,
        sessionTime,
        sessionDuration,
    } = req.body;

    const mentor = await MentorProfile.findById(mentorId);

    if (!mentor) {
        throw new ApiError(404, "Mentor not found");
    }

    const booking = await Booking.create({
        student: req.user._id,
        mentor: mentor._id,
        sessionDate,
        sessionTime,
        sessionDuration,
        bookingType: mentor.isFreeMentorship ? "free" : "paid",
        amount: mentor.isFreeMentorship ? 0 : mentor.pricing,
        paymentStatus: mentor.isFreeMentorship ? "paid" : "pending",
        meetingId: randomUUID(),
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            booking,
            "Session booked successfully"
        )
    );

});

const getMyBookings = asyncHandler(async (req, res) => {

    const bookings = await Booking.find({
        student: req.user._id,
    })
    .populate({
        path: "mentor",
        populate: {
            path: "user",
            select: "fullName email avatar",
        },
    })
    .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "Bookings fetched successfully"
        )
    );
});

const cancelBooking = asyncHandler(async (req, res) => {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.student.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    booking.bookingStatus = "cancelled";

    await booking.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking cancelled successfully"
        )
    );
});

const rescheduleBooking = asyncHandler(async (req, res) => {

    const { sessionDate, sessionTime } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.student.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    booking.sessionDate = sessionDate;
    booking.sessionTime = sessionTime;
    booking.bookingStatus = "pending";

    await booking.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking rescheduled successfully"
        )
    );
});

export {bookSession,getMyBookings,cancelBooking,rescheduleBooking};