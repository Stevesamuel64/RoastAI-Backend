export const getFunnyFeud = async (req, res, next) => {
  const { prompt, selectedCharacter1, selectedCharacter2 } = req.body;

  try {
    if (
      !prompt.trim() ||
      !selectedCharacter1.trim() ||
      !selectedCharacter2.trim()
    ) {
      return res.status(400).json({
        error:
          'All fields (prompt, selectedCharacter1, selectedCharacter2) are required and cannot be empty.',
      });
    }

    const debatePrompt = `
          You are an AI that generates a funny debate between two characters. 
          Characters: 
          1. ${selectedCharacter1} 
          2. ${selectedCharacter2} 
          
          Topic: ${prompt}
          
          Instructions:
          - Make it humorous and light-hearted.
          - Each character should take turns roasting the other.
          - Each turn should be 2-3 sentences.
          - Generate at least 10 exchanges (so character1 goes first, then character2, back and forth, until 10+ lines each).
          - Respond **only in JSON**, no formatting, no explanations, no text outside the JSON.
          - Each entry should have the keys: 
            - "name": character's name
            - "body": character's line
          
          Return the JSON array like this:
          [
            { "name": "${selectedCharacter1}", "body": "[funny line]" },
            { "name": "${selectedCharacter2}", "body": "[funny comeback]" },
            ...
          ]
          `;

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.API_KEY_Funny_Feud}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'user',
              content: debatePrompt,
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
