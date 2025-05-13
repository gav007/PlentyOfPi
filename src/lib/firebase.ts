
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics"; // Optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "FIREBASE CONFIGURATION ERROR: Missing Firebase API Key or Project ID. \n" +
    "Please ensure all NEXT_PUBLIC_FIREBASE_... environment variables are correctly set in your .env.local file (for local development) or in your hosting environment variables. \n" +
    "Firebase services will not function correctly until these are provided. \n" +
    "Refer to your Firebase project settings in the Firebase console (Project settings > General > Your apps > SDK setup and configuration) to find these values."
  );
  // Initialize with mock values to prevent hard crashes if parts of the app try to import auth/db
  // but cannot function without a properly configured Firebase app.
  // This is primarily for a better developer experience during setup.
  if (!getApps().length) {
    app = initializeApp({ 
      apiKey: "mock-key-for-init-please-set-real-key", 
      authDomain: "mock.firebaseapp.com",
      projectId: "mock-project-for-init-please-set-real-id",
    });
  } else {
    app = getApp();
  }
  // These will likely still fail or be non-functional if Firebase attempts operations,
  // but importing them might not crash the entire app immediately.
  auth = getAuth(app); 
  db = getFirestore(app);

} else {
  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  // const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; // Optional
}

export { app, auth, db };
