import fetch from 'node-fetch';
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.LLAMA_API_KEY;

export const generateFunnySummary = async (text) => {
    if (!text) {
        console.error("❌ generateFunnySummary called with undefined text");
        return;
    }
    const limitedText = text.slice(0, 15);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
                "messages": [
                    {
                        role: "system",
                        content: `You are RoastAI, a witty AI whose only goal is to turn plain news into funny, clever summaries. Always structure your reply as a JSON array of objects, with each object having:
                                 - "title": a short, catchy headline
                                 - "description": the funny/clever roast version of the news
                                 - "link": include if available, otherwise null

                                 Return only a valid JSON array. Strictly no text outside JSON .`
                    },
                    {
                        role: "user",
                        content: `You are a witty AI. Take the text I send, make it funnier with clever humour, and reply in the same structure and style as the input just funnier Escape all quotes inside strings with backslashes and do not include any text outside JSON. Here’s the data -${limitedText}`
                    }
                ]
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        let content = data.choices[0].message.content;

        // Optional: trim anything outside the JSON array
        const firstBracket = content.indexOf('[');
        const lastBracket = content.lastIndexOf(']');
        content = content.slice(firstBracket, lastBracket + 1);

        // ✅ Do NOT replace quotes or newlines manually
        return JSON.parse(content);


    } catch (err) {
        console.error("OpenRouter Error:", err);
        return null;
    }
};