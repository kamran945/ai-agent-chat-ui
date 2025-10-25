// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB58uzl8W2jAblL0euwrmNr20a0cDm48OQ",
//   authDomain: "ai-agent-chat-ui-d5c6a.firebaseapp.com",
//   projectId: "ai-agent-chat-ui-d5c6a",
//   storageBucket: "ai-agent-chat-ui-d5c6a.firebasestorage.app",
//   messagingSenderId: "226455654421",
//   appId: "1:226455654421:web:55f4d1845f510fcc03be1c",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCdUAMzOs-RS0vJe6vbIf8qJ3rUxs08FFs",
  authDomain: "agent-chat-ui-8556b.firebaseapp.com",
  projectId: "agent-chat-ui-8556b",
  storageBucket: "agent-chat-ui-8556b.firebasestorage.app",
  messagingSenderId: "16096019837",
  appId: "1:16096019837:web:7b6a7fa5eb6cf1781fb814",
};

// Initialize Firebase
// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
