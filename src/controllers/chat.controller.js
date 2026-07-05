import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createConversation = asyncHandler(async (req, res) => {

    const { receiverId } = req.body;

    const existingConversation = await Conversation.findOne({
        participants: {
            $all: [req.user._id, receiverId],
        },
    });

    if (existingConversation) {
        return res.status(200).json(
            new ApiResponse(
                200,
                existingConversation,
                "Conversation already exists"
            )
        );
    }

    const conversation = await Conversation.create({
        participants: [
            req.user._id,
            receiverId,
        ],
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            conversation,
            "Conversation created successfully"
        )
    );

});

const getConversations = asyncHandler(async (req, res) => {

    const conversations = await Conversation.find({
        participants: req.user._id,
    }).populate(
        "participants",
        "fullName avatar role"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversations,
            "Conversations fetched successfully"
        )
    );

});

const getMessages = asyncHandler(async (req, res) => {

    const messages = await Message.find({
        conversation: req.params.conversationId,
    }).populate(
        "sender",
        "fullName avatar"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            messages,
            "Messages fetched successfully"
        )
    );

});

export {
    createConversation,
    getConversations,
    getMessages,
};