import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getMeetingDetails = asyncHandler(async (req, res) => {

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (
        booking.student.toString() !== req.user._id.toString()
    ) {

        const mentorProfile = await booking.populate("mentor");

        if (
            mentorProfile.mentor.user.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(403, "Unauthorized");
        }
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                meetingId: booking.meetingId,
                sessionDate: booking.sessionDate,
                sessionTime: booking.sessionTime,
            },
            "Meeting details fetched successfully"
        )
    );

});

export {
    getMeetingDetails,
};