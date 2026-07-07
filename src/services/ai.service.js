import ai from "../config/gemini.js";

const generateAIResponse = async (prompt) => {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;

};

export default generateAIResponse;

