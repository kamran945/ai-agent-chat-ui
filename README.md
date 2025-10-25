# ai-agent-chat-ui

Functional and interactive AI agent chat UI

# AI Agent Chat UI

A **chat interface for AI agents** built with TypeScript, Next.js, React, Tailwind CSS, Auth.js, Firebase, and Groq Cloud models. This project demonstrates a functional and interactive AI agent chat UI, focusing primarily on the frontend experience and chat interactions.

---

<video controls src="https://github.com/user-attachments/assets/5062f40b-2a7e-434a-bcd1-c5446234f651" style="max-width:600px;"></video>

---

## Features

- **Interactive AI chat UI** that adjusts to different screen sizes
- **Chat history display** for previous conversations
- **Dark and Light mode** support
- **Scalable architecture** with global CSS and Tailwind CSS integration
- **Flexible and extensible**: UI can be improved, customized, or reused for different projects
- Integration with **Google OAuth authentication** via Auth.js
- Firebase Firestore integration for user and message storage
- Avatar support for signed-in users
- Integration with **Groq models** via API

---

## 🧠 Technologies Used

This project integrates several modern tools and services to handle authentication, database management, and AI model inference.

### 🔐 **Authentication & User Management**

**Auth.js (NextAuth.js)**  
Used to manage user sessions and authentication within the Next.js app.  
It provides secure, server-side session handling and easy integration with OAuth providers.

- **Why:** Simplifies authentication flow and session management.
- **Docs:** [https://authjs.dev](https://authjs.dev)

**Google OAuth via Firebase**  
Google sign-in is configured using Firebase and Auth.js for a seamless login experience.

- **Why:** Provides trusted and convenient authentication for users through their Google accounts.
- **Setup:** Uses `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env`.

---

### 🔥 **Database & Cloud Infrastructure**

**Firebase (Firestore & Admin SDK)**  
Used for real-time database operations and secure server-side access.

- **Firestore:** Stores user and chat data.
- **Firebase Admin SDK:** Handles privileged operations on the backend.
- **Why:** Provides scalable, secure, and easily managed cloud storage and authentication.
- **Env Variables:**
  - `FIREBASE_SERVICE_ACCOUNT_KEY` — for server-side admin access.
  - `firebaseConfig` — client-side initialization.

---

### 🤖 **AI Model Integration**

**Groq Cloud API**  
Used to connect and run inference on hosted AI models through Groq Cloud.

- **Why:** Enables high-performance, low-latency model responses for chat and reasoning tasks.
- **Setup:**
  - Install `groq-sdk`.
  - Add `GROQ_API_KEY` to `.env`.

---

### ⚙️ **Supporting Stack**

- **Next.js 14** — App router-based React framework.
- **React** — Component-based UI.
- **Lucide React / React Icons** — Icon sets for UI elements.
- **React Hot Toast** — Lightweight notifications.
- **Firebase Admin** — Secure backend access for Firestore.

---

## Usage

1. Clone the repository `git clone https://github.com/kamran945/ai-agent-chat-ui`
2. `cd ai-agent-chat-ui`
3. `npm install`
4. Setup Environment Variables (Detail Below)
5. `npm run dev`

## Environment Variables

You will need to configure the following environment variables in a .env file:

# Firebase

FIREBASE_SERVICE_ACCOUNT_KEY=...

# Google OAuth

AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...

# Groq Cloud

GROQ_API_KEY=...

Ensure your Firebase project, OAuth consent screen, and Groq API are properly configured.

## Learn More

[Next.js Documentation](https://nextjs.org/docs)

[Auth.js Documentation](https://authjs.dev/getting-started/installation)

[Firebase Documentation](https://firebase.google.com/docs)

[Groq Cloud API](https://console.groq.com/docs/overview)
