import MentorProfile from "../models/MentorProfile.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createMentorProfile = asyncHandler(async (req, res) => {

    if (req.user.role !== "mentor") {
        throw new ApiError(403, "Only mentors can create profile");
    }

    const existingProfile = await MentorProfile.findOne({
        user: req.user._id,
    });

    if (existingProfile) {
        throw new ApiError(409, "Profile already exists");
    }

    const mentorProfile = await MentorProfile.create({
        ...req.body,
        user: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            mentorProfile,
            "Mentor profile created successfully"
        )
    );
});

const updateMentorProfile = asyncHandler(async (req, res) => {

    if (req.user.role !== "mentor") {
        throw new ApiError(403, "Only mentors can update profile");
    }

    const mentor = await MentorProfile.findOneAndUpdate(
        { user: req.user._id },
        {
            $set: req.body,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!mentor) {
        throw new ApiError(404, "Mentor profile not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            mentor,
            "Profile updated successfully"
        )
    );
});

const getMentorProfile = asyncHandler(async (req, res) => {

    const mentor = await MentorProfile.findById(req.params.id)
        .populate(
            "user",
            "fullName email avatar"
        );

    if (!mentor) {
        throw new ApiError(404, "Mentor not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            mentor,
            "Mentor profile fetched successfully"
        )
    );

});

const getAllMentors = asyncHandler(async (req, res) => {

    const mentors = await MentorProfile.find({
        verificationStatus: "approved",
    }).populate(
        "user",
        "fullName email avatar"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            mentors,
            "Mentors fetched successfully"
        )
    );

});

export {
    createMentorProfile,
    updateMentorProfile,
    getMentorProfile,
    getAllMentors,
};