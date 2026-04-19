import { initializeApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase config is valid
const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'AIzaSyDummyKey123456789012345678901234567890' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'dummy-project-id';

// Only initialize Auth — Firestore and Storage are not used on the frontend.
// Firebase is purely a "bridge" for authentication: we get an idToken from
// Firebase and exchange it for our own backend JWT. All user data comes from
// our backend (GET /users/profile), not from Firebase.
let auth: ReturnType<typeof getAuth> | null = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    setPersistence(auth, inMemoryPersistence).catch(() => {
      // Non-critical — auth still works for sign-in
    });
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
} else {
  console.warn(
    'Firebase is not configured. Please update .env with your Firebase credentials.'
  );
}

export { auth };
