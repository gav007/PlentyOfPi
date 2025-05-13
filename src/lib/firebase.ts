
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
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
  console.warn( // Changed from console.error
    "FIREBASE CONFIGURATION WARNING: Missing Firebase API Key or Project ID.\n" +
    "Essential Firebase environment variables (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID) are not set.\n" +
    "The application will attempt to initialize with a mock/fallback configuration for basic functionality or build purposes, but full Firebase services will be unavailable or may result in errors (e.g., auth/invalid-api-key when attempting operations).\n" +
    "Please set these variables in your .env.local file (for local development) or in your hosting environment for full functionality.\n" +
    "Refer to README.md and your Firebase project settings."
  );

  // Initialize with mock values to prevent hard crashes if parts of the app try to import auth/db
  // This is primarily for a better developer experience during setup or for build environments.
  if (!getApps().length) {
    app = initializeApp({ 
      apiKey: "mock-key-for-init-please-set-real-key", 
      authDomain: "mock.firebaseapp.com",
      projectId: "mock-project-for-init-please-set-real-id",
      storageBucket: "mock.appspot.com", // Added
      messagingSenderId: "000000000000", // Added
      appId: "mock-app-id-for-init", // Added
      measurementId: "mock-measurement-id" // Added, optional
    });
  } else {
    app = getApp();
  }
  
  // These will likely still fail for actual Firebase operations or be non-functional,
  // but importing them might not crash the entire app immediately.
  try {
    auth = getAuth(app); 
    db = getFirestore(app);
  } catch (e) {
    console.error(
        "Fallback Firebase initialization for auth/db failed even with mock app. " +
        "This may lead to runtime errors if Firebase services are used. Error:", e
    );
    // To prevent crashes, assign placeholder objects that won't work but allow type consistency.
    // This is an extreme fallback.
    auth = {} as Auth;
    db = {} as Firestore;
  }

} else {
  // Initialize Firebase normally
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  // const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; // Optional
}

export { app, auth, db };
