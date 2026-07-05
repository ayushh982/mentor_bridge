import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
        },
        slots: [
            {
                type: String,
            },
        ],
    },
    { _id: false }
);

const mentorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        profileHeadline: {
            type: String,
            trim: true,
        },

        bio: {
            type: String,
            trim: true,
        },

        company: {
            type: String,
            trim: true,
        },

        designation: {
            type: String,
            trim: true,
        },

        experience: {
            type: Number,
            default: 0,
        },

        skills: [
            {
                type: String,
            },
        ],

        linkedin: {
            type: String,
        },

        github: {
            type: String,
        },

        pricing: {
            type: Number,
            default: 0,
        },

        isFreeMentorship: {
            type: Boolean,
            default: true,
        },

        sessionDuration: {
            type: Number,
            default: 30,
        },

        availability: [availabilitySchema],

        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        averageRating: {
            type: Number,
            default: 0,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("MentorProfile", mentorSchema);