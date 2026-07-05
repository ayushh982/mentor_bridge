import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MentorProfile",
            required: true,
        },

        sessionDate: {
            type: Date,
            required: true,
        },

        sessionTime: {
            type: String,
            required: true,
        },

        sessionDuration: {
            type: Number,
            default: 30,
        },

        bookingType: {
            type: String,
            enum: ["free", "paid"],
            default: "free",
        },

        amount: {
            type: Number,
            default: 0,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        bookingStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "completed",
                "cancelled"
            ],
            default: "pending",
        },

        meetingId: {
            type: String,
            default: "",
        },

        meetingStatus: {
            type: String,
            enum: ["not_started", "ongoing", "ended"],
            default: "not_started",
        },
        isReviewed: {
        type: Boolean,
        default: false,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Booking", bookingSchema);