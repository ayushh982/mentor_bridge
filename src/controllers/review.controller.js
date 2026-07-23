import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import MentorProfile from "../models/MentorProfile.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createReview = asyncHandler(async (req, res) => {

    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.student.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    if (booking.bookingStatus !== "completed") {
        throw new ApiError(400, "Session not completed");
    }

    if (booking.isReviewed) {
    throw new ApiError(409, "Review already submitted");
    }

   

    const alreadyReviewed = await Review.findOne({
        booking: bookingId,
    });

    if (alreadyReviewed) {
        throw new ApiError(409, "Review already submitted");
    }

    const review = await Review.create({
        student: req.user._id,
        mentor: booking.mentor,
        booking: bookingId,
        rating,
        comment,
    });
    booking.isReviewed = true;
    await booking.save();

    const reviews = await Review.find({
        mentor: booking.mentor,
    });

    const totalReviews = reviews.length;

    const averageRating =
        reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews;

    await MentorProfile.findByIdAndUpdate(
        booking.mentor,
        {
            averageRating,
            totalReviews,
        }
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            review,
            "Review submitted successfully"
        )
    );

});

const getMentorReviews = asyncHandler(async (req, res) => {

    const reviews = await Review.find({
        mentor: req.params.mentorId,
    }).populate(
        "student",
        "fullName avatar"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            reviews,
            "Reviews fetched successfully"
        )
    );

});

const deleteReview = asyncHandler(async (req, res) => {

    const review = await Review.findById(req.params.id);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    if (review.student.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await review.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Review deleted successfully"
        )
    );

});

const getMyReviews = asyncHandler(async (req, res) => {

    const mentor = await MentorProfile.findOne({
        user: req.user._id,
    });

    if (!mentor) {
        throw new ApiError(404, "Mentor not found");
    }

    const reviews = await Review.find({
        mentor: mentor._id,
    })
    .populate("student", "fullName avatar")
    .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            reviews,
            "Reviews fetched successfully"
        )
    );

});

export {
    createReview,
    getMentorReviews,
    deleteReview,
    getMyReviews
};