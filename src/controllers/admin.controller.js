import User from "../models/User.js";
import MentorProfile from "../models/MentorProfile.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getPendingMentors = asyncHandler(async (req, res) => {

    const mentors = await MentorProfile.find({
        verificationStatus: "pending",
    }).populate(
        "user",
        "fullName email"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            mentors,
            "Pending mentors fetched successfully"
        )
    );
});


const approveMentor = asyncHandler(async (req, res) => {

    const mentor = await MentorProfile.findByIdAndUpdate(
        req.params.id,
        {
            verificationStatus: "approved",
        },
        {
            new: true,
        }
    );

    if (!mentor) {
        throw new ApiError(404, "Mentor not found");
    }

    await User.findByIdAndUpdate(
        mentor.user,
        {
            isVerified: true,
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            mentor,
            "Mentor approved successfully"
        )
    );
});

const rejectMentor = asyncHandler(async (req, res) => {

    const mentor = await MentorProfile.findByIdAndUpdate(
        req.params.id,
        {
            verificationStatus: "rejected",
        },
        {
            new: true,
        }
    );

    if (!mentor) {
        throw new ApiError(404, "Mentor not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            mentor,
            "Mentor rejected successfully"
        )
    );
});

const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find()
        .select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        )
    );
});

export {
    getPendingMentors,
    approveMentor,
    rejectMentor,
    getAllUsers,
};