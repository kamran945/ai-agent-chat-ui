import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceKey) {
    throw new Error("FIREBASE_SERVICE_KEY not found in environment variables.");
  }

  let parsedKey;
  try {
    parsedKey = JSON.parse(serviceKey);
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_KEY:", error);
    throw new Error("Invalid FIREBASE_SERVICE_KEY JSON format.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(parsedKey as admin.ServiceAccount),
  });
}

export const adminDB = admin.firestore();
