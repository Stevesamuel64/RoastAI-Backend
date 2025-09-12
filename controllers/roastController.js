import { callChatbotApi } from "../config/chatbotApi.js"

export const getRoastResponse = async (req, res, next) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const roast = await callChatbotApi(prompt);
        if (!roast) {
            return res.status(500).json({ message: "Failed to get a response from the chatbot" });
        }
        return res.status(200).json({ roast, prompt });
    } catch (error) {
        next(error); 
    }
}