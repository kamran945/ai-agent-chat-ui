// --- askAgent Function ---
// Sends a user message to the Groq AI API and returns the assistant's response.

import groq from "@/app/agent/groqClient";

// Handles errors gracefully and provides fallback messaging.
export const askAgent = async (
  userMessage: string,
  chatHistory: string,
  id: string,
  model: string
): Promise<string> => {
  try {
    // --- Create chat completion request ---
    // Includes a system prompt and the user's message
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Groq, a helpful AI Assistant. You have access to recent chat history with the user. Always use this as reference in responses. Here is the chat history: \n${chatHistory}\n Current user message is: `,
        },
        { role: "user", content: userMessage },
      ],
      model: model || "openai/gpt-oss-20b", // Default to GPT-OSS 20B if model not provided
    });

    // --- Extract assistant reply safely ---
    // Provide a default message if Groq does not return content
    const content =
      chatCompletion.choices?.[0]?.message?.content ??
      "Groq didn’t provide a response.";

    return content;
  } catch (error: unknown) {
    // --- Error Handling ---
    console.error("Groq API Error:", error);
    return `Groq was unable to find an answer for that! Error: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
};

export default askAgent;
