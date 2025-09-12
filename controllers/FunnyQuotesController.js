export const getFunnyQuote = async (req, res, next) => {
  try {
    const FunnyQuote = `
             You are an AI that finds real-world quotes and makes them funny.  
             Instructions:
             - Fetch 10 real quotes from famous people, books, movies, or common sayings.  
             - For each quote, include: 
               - "original": the real quote you found  
               - "funnyQuote": a humorous or absurd version of that quote  
             - Each funnyQuote should be light-hearted and absurd.  
             - Respond **only in JSON**, no extra text.  
             
             Return the JSON array like this:  
             [
               { "quote": "[real quote 1]", "funnyQuote": "[funny version 1]" },
               { "quote": "[real quote 2]", "funnyQuote": "[funny version 2]" },
               { "quote": "[real quote 3]", "funnyQuote": "[funny version 3]" },
               { "quote": "[real quote 4]", "funnyQuote": "[funny version 4]" },
               { "quote": "[real quote 5]", "funnyQuote": "[funny version 5]" }
             ]
          `;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.API_KEY_Funny_Quote}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "user",
              content: FunnyQuote,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const chatbotReply =
          data.choices?.[0]?.message?.content || "No response from chatbot";

    return res.status(200).json({ chatbotReply });
  } catch (error) {
    next(error);
  }
};
