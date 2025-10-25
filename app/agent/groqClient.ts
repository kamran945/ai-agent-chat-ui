import Groq from "groq-sdk";

// --- Groq Client Initialization ---
// Creates and exports a configured Groq SDK instance for API interactions.
// Uses the GROQ_API_KEY from environment variables for authentication.
const groq = new Groq({
  apiKey: process.env["GROQ_API_KEY"], // Ensure this key is set in your environment
});

export default groq;
