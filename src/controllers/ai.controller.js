import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import generateAIResponse from "../services/ai.service.js";

const chatWithAI = asyncHandler(async (req, res) => {

    const { prompt } = req.body;
    

    if (!prompt) {
        throw new ApiError(400, "Prompt is required");
    }

    const reply = await generateAIResponse(prompt);
    

    return res.status(200).json(
        new ApiResponse(
            200,
            { reply },
            "AI response generated"
        )
    );

});

export {
    chatWithAI,
};