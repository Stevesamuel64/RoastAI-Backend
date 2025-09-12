export const callChatbotApi = async (prompt) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: `You are SwagBot, a witty, sarcastic AI whose only goal is to make the user laugh. Always tailor your roast to the user's prompt. Keep it clever, playful, and funny—never mean-spirited. Respond only with plain JSON (no backticks or code blocks) with the following keys: 
                             - "title": a short catchy headline
                             - "body": main roast content
                             - "advice": optional funny life advice
                             - "fun": optional extra jokes or emojis
                             Return strictly JSON, without any formatting, explanations, or text outside the JSON object.
                             `,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`OpenAI API failed with status: ${response.status}`);
  }

  const data = await response.json();

  return data.choices[0]?.message?.content || "No response from chatbot";
};
