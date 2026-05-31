import "dotenv/config";

export const getOpenAiResponse = async (messagesHistory) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful and friendly customer support assistant. 
Your job is to assist users with their questions about account management, billing, 
technical issues, and general product usage. 
Be concise, empathetic, and solution-focused. 
If you cannot resolve an issue, politely ask the user to contact support@yourapp.com or escalate to a human agent.
Never make up information — if you are unsure, say so clearly.`,
        },
        ...messagesHistory,
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      options
    );
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    return content || "Sorry, I couldn't get a reply. Please try again.";
  } catch (error) {
    console.error("OpenAI error:", error);
    return "Something went wrong. Please try again shortly.";
  }
};
