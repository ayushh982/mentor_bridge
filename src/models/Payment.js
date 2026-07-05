import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },

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

        razorpayOrderId: {
            type: String,
            required: true,
        },

        razorpayPaymentId: {
            type: String,
            default: "",
        },

        razorpaySignature: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);