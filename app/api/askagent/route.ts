import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { adminDB } from "@/firebaseAdmin";

import askAgent from "@/app/agent/groqApi";

// --- POST Request Handler ---
// Handles incoming chat messages, forwards them to the AI agent,
// and stores the AI response in Firestore.
export const POST = async (req: NextRequest) => {
  // --- Parse Request Body ---
  const reqBody = await req.json();

  // Extract required fields from the request payload
  const { message, chathistory, id, model, session } = reqBody;

  try {
    // --- Input Validation ---
    if (!message) {
      // Return 400 if no chat message is provided
      return NextResponse.json(
        {
          message: "Please provide a chat input.",
        },
        { status: 400 }
      );
    }
    if (!id) {
      // Return 400 if no chat ID is provided
      return NextResponse.json(
        {
          message: "Please provide a valid chat ID.",
        },
        { status: 400 }
      );
    }

    // --- AI Response Generation ---
    // Call the external AI agent API with the user's message, chat ID, and model
    const response = await askAgent(message, chathistory, id, model);

    // --- Prepare AI Message Object ---
    const aiMessage = {
      text: response,
      // Use Firestore server timestamp for consistent creation time
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      user: {
        _id: "AI", // Identifier for AI messages
        name: "AI", // Display name for AI messages
        avatar: null, // No avatar for AI
      },
    };

    // --- Store AI Message in Firestore ---
    // Messages are nested under: users -> session -> chats -> chat ID -> messages
    await adminDB
      .collection("users")
      .doc(session)
      .collection("chats")
      .doc(id)
      .collection("messages")
      .add(aiMessage);

    // --- Success Response ---
    // Return the original user message and success flag
    return NextResponse.json(
      {
        message: message?.text,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    // --- Error Handling ---
    // Return 500 with error details in case of exceptions
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
};
