import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


const createOrder = asyncHandler(async (req, res) => {

    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.student.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    const options = {
        amount: booking.amount * 100,
        currency: "INR",
        receipt: booking._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
        booking: booking._id,
        student: booking.student,
        mentor: booking.mentor,
        razorpayOrderId: order.id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "Order created successfully"
        )
    );
});

const verifyPayment = asyncHandler(async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(
            razorpay_order_id + "|" + razorpay_payment_id
        )
        .digest("hex");

    if (generatedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment verification failed");
    }

    const payment = await Payment.findOne({
        razorpayOrderId: razorpay_order_id,
    });

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";

    await payment.save();

    await Booking.findByIdAndUpdate(
        payment.booking,
        {
            paymentStatus: "paid",
            bookingStatus: "confirmed",
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            payment,
            "Payment successful"
        )
    );
});

const getMyPayments = asyncHandler(async (req, res) => {

    const payments = await Payment.find({
        student: req.user._id,
    })
    .populate("booking")
    .populate({
        path: "mentor",
        populate: {
            path: "user",
            select: "fullName",
        },
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            payments,
            "Payments fetched successfully"
        )
    );
});

export {
    createOrder,
    verifyPayment,
    getMyPayments,
};