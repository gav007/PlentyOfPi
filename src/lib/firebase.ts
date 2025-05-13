
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
  console.warn( 
    "FIREBASE CONFIGURATION WARNING: Missing Firebase API Key or Project ID.\n" +
    "Essential Firebase environment variables (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID) are not set.\n" +
    "The application will attempt to initialize with a mock/fallback configuration for build purposes or basic non-Firebase functionality, but full Firebase services will be unavailable or may result in errors (e.g., auth/invalid-api-key when attempting operations).\n" +
    "Please set these variables in your .env.local file (for local development) or in your hosting environment for full Firebase functionality.\n" +
    "Refer to README.md and your Firebase project settings."
  );

  if (!getApps().length) {
    app = initializeApp({ 
      apiKey: "mock-key-for-init-please-set-real-key", 
      authDomain: "mock.firebaseapp.com",
      projectId: "mock-project-for-init-please-set-real-id",
      storageBucket: "mock.appspot.com",
      messagingSenderId: "000000000000",
      appId: "mock-app-id-for-init",
      measurementId: "mock-measurement-id"
    });
  } else {
    app = getApp();
  }
  
  try {
    auth = getAuth(app); 
    db = getFirestore(app);
  } catch (e) {
    console.error(
        "Fallback Firebase initialization for auth/db failed even with mock app. " +
        "This may lead to runtime errors if Firebase services are used. Error:", e
    );
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
