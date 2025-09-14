export const getFunnyCharacterResponse = async (req, res, next) => {
  const { prompt, characterName } = req.body;

  try {
    if (!prompt.trim() || !characterName.trim()) {
      return res.status(400).json({
        error:
          'Both prompt and characterName are required and cannot be empty.',
      });
    }

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.API_KEY_Funny_Characters}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: `Whenever you respond, take the subject and respond in a funny way in the style of ${characterName} (a person or country). Make me laugh, and make sure ${characterName} also criticizes themselves in the response.
              Respond only with plain JSON (no backticks or code blocks) with the following keys: 
                             - "title": a short catchy headline
                             - "body": main roast content
                             - "advice": optional funny life advice
                             - "fun": optional extra jokes or emojis
                             Return strictly JSON, without any formatting, explanations, or text outside the JSON object.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const chatbotReply =
      data.choices?.[0]?.message?.content || 'No response from chatbot';

    return res.status(200).json({ chatbotReply, prompt });
  } catch (error) {
    next(error);
  }
};
