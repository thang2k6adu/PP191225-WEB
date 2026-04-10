import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '@/config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  confirmPasswordReset,
} from 'firebase/auth';
import {
  LoginCredentials,
  SignUpCredentials,
  FirebaseLoginRequest,
  FirebaseUserData,
  TokenData,
} from '@/types/auth';
import { User } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthPayload {
  user: User;
  token: string;
}

interface FirebaseAuthPayload {
  user: FirebaseUserData;
  tokens: TokenData;
}

// Helper function to create user data from Firebase user
const createUserData = (
  firebaseUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  },
  displayName?: string
): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: displayName || firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined,
    role: 'user' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Helper function to handle Firebase errors
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  const errorObj = error as { code?: string; message?: string };
  if (errorObj?.code === 'auth/invalid-credential') {
    return 'Invalid email or password';
  }
  if (errorObj?.code === 'auth/email-already-in-use') {
    return 'Email already in use';
  }
  if (errorObj?.code === 'auth/user-not-found') {
    return 'User not found';
  }
  if (errorObj?.code === 'auth/account-exists-with-different-credential') {
    return 'An account with this email already exists with a different sign-in method. Please use your original sign-in method.';
  }
  if (errorObj?.code === 'auth/popup-blocked') {
    return 'Sign-in popup was blocked. Please allow popups and try again.';
  }
  if (errorObj?.code === 'auth/popup-closed-by-user') {
    return 'Sign-in popup was closed. Please try again.';
  }
  if (errorObj?.code === 'auth/cancelled-popup-request') {
    return 'Sign-in was cancelled. Please try again.';
  }
  return errorObj?.message || defaultMessage;
};

// Helper to get device ID
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `web_${navigator.userAgent.split(' ').pop()}_${Date.now()}`;
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

// Firebase Login Thunk
export const loginWithFirebaseThunk = createAsyncThunk<
  FirebaseAuthPayload,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginWithFirebase', async (credentials, { rejectWithValue }) => {
  console.log('🔵 [loginWithFirebaseThunk] Starting...');

  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    console.error('❌ [loginWithFirebaseThunk] Firebase not configured');
    return rejectWithValue(error);
  }

  try {
    // Step 1: Login with Firebase
    console.log('🔵 [loginWithFirebaseThunk] Step 1: Logging into Firebase...');
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    console.log('✅ [loginWithFirebaseThunk] Firebase login successful');

    // Step 2: Get idToken từ Firebase
    console.log('🔵 [loginWithFirebaseThunk] Step 2: Getting idToken...');
    const idToken = await userCredential.user.getIdToken();
    console.log('✅ [loginWithFirebaseThunk] idToken obtained');

    // Step 3: Send idToken to Backend
    console.log('🔵 [loginWithFirebaseThunk] Step 3: Calling backend...');
    const loginRequest: FirebaseLoginRequest = {
      idToken,
      deviceId: getDeviceId(),
      platform: 'web',
    };

    const response = await authService.loginWithFirebase(loginRequest);
    console.log('🔵 [loginWithFirebaseThunk] Backend response:', response);

    if (response.error || !response.data) {
      console.error(
        '❌ [loginWithFirebaseThunk] Backend returned error:',
        response.message
      );
      return rejectWithValue(response.message || 'Firebase login failed');
    }

    // Step 4: Return response from backend
    console.log('✅ [loginWithFirebaseThunk] Login complete, returning data');
    return {
      user: response.data.user,
      tokens: response.data.tokens,
    };
  } catch (error: unknown) {
    console.error('❌ [loginWithFirebaseThunk] Error caught:', error);
    const errorMessage = getErrorMessage(error, 'Firebase login failed');
    return rejectWithValue(errorMessage);
  }
});

// Firebase Sign Up Thunk
export const signUpWithFirebaseThunk = createAsyncThunk<
  FirebaseAuthPayload,
  { email: string; password: string; displayName?: string },
  { rejectValue: string }
>('auth/signUpWithFirebase', async (credentials, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    // Step 1: Create user with Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // Step 2: Update displayName if provided
    if (credentials.displayName) {
      // Optional: Update user profile with displayName
      // This is handled in the backend during token verification
    }

    // Step 3: Get idToken từ Firebase
    const idToken = await userCredential.user.getIdToken();

    // Step 4: Send idToken to Backend with signup info
    const signUpRequest: FirebaseLoginRequest = {
      idToken,
      deviceId: getDeviceId(),
      platform: 'web',
    };

    const response = await authService.signUpWithFirebase(signUpRequest);

    if (response.error || !response.data) {
      return rejectWithValue(response.message || 'Firebase sign up failed');
    }

    // Step 5: Return response from backend
    return {
      user: response.data.user,
      tokens: response.data.tokens,
    };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Firebase sign up failed');
    return rejectWithValue(errorMessage);
  }
});

// Login thunk
export const loginThunk = createAsyncThunk<
  AuthPayload,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const token = await userCredential.user.getIdToken();
    const userData = createUserData(userCredential.user);

    localStorage.setItem('token', token);

    return { user: userData, token };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Login failed');
    return rejectWithValue(errorMessage);
  }
});

// Sign up thunk
export const signUpThunk = createAsyncThunk<
  AuthPayload,
  SignUpCredentials,
  { rejectValue: string }
>('auth/signUp', async (credentials, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const token = await userCredential.user.getIdToken();
    const userData = createUserData(
      userCredential.user,
      credentials.displayName
    );

    localStorage.setItem('token', token);

    return { user: userData, token };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Sign up failed');
    return rejectWithValue(errorMessage);
  }
});

// Logout thunk
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
  if (!auth) {
    localStorage.removeItem('token');
    return;
  }

  try {
    await signOut(auth);
    localStorage.removeItem('token');
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Logout failed');
    return rejectWithValue(errorMessage);
  }
});

// Google sign in thunk
export const signInWithGoogleThunk = createAsyncThunk<
  FirebaseAuthPayload,
  void,
  { rejectValue: string }
>('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Get idToken from Firebase
    const idToken = await userCredential.user.getIdToken();

    // Send idToken to backend
    const loginRequest: FirebaseLoginRequest = {
      idToken,
      deviceId: getDeviceId(),
      platform: 'web',
    };

    const response = await authService.loginWithFirebase(loginRequest);

    if (response.error || !response.data) {
      return rejectWithValue(response.message || 'Google sign in failed');
    }

    return {
      user: response.data.user,
      tokens: response.data.tokens,
    };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Google sign in failed');
    return rejectWithValue(errorMessage);
  }
});

// Facebook sign in thunk (Firebase -> Backend tokens)
export const signInWithFacebookThunk = createAsyncThunk<
  FirebaseAuthPayload,
  void,
  { rejectValue: string }
>('auth/signInWithFacebook', async (_, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Get idToken from Firebase
    const idToken = await userCredential.user.getIdToken();

    // Send idToken to backend
    const loginRequest: FirebaseLoginRequest = {
      idToken,
      deviceId: getDeviceId(),
      platform: 'web',
    };

    const response = await authService.loginWithFirebase(loginRequest);

    if (response.error || !response.data) {
      return rejectWithValue(response.message || 'Facebook sign in failed');
    }

    return {
      user: response.data.user,
      tokens: response.data.tokens,
    };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Facebook sign in failed');
    return rejectWithValue(errorMessage);
  }
});

// GitHub sign in thunk (Firebase -> Backend tokens)
export const signInWithGitHubThunk = createAsyncThunk<
  FirebaseAuthPayload,
  void,
  { rejectValue: string }
>('auth/signInWithGitHub', async (_, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Get idToken from Firebase
    const idToken = await userCredential.user.getIdToken();

    // Send idToken to backend
    const loginRequest: FirebaseLoginRequest = {
      idToken,
      deviceId: getDeviceId(),
      platform: 'web',
    };

    const response = await authService.loginWithFirebase(loginRequest);

    if (response.error || !response.data) {
      return rejectWithValue(response.message || 'GitHub sign in failed');
    }

    return {
      user: response.data.user,
      tokens: response.data.tokens,
    };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'GitHub sign in failed');
    return rejectWithValue(errorMessage);
  }
});

// Forgot password thunk
export const forgotPasswordThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    await authService.forgotPassword(email);
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Failed to send reset email');
    return rejectWithValue(errorMessage);
  }
});

// Reset password thunk (using oobCode from email link)
export const resetPasswordThunk = createAsyncThunk<
  void,
  { oobCode: string; newPassword: string },
  { rejectValue: string }
>(
  'auth/resetPassword',
  async ({ oobCode, newPassword }, { rejectWithValue }) => {
    if (!auth) {
      const error =
        'Firebase is not configured. Please set up Firebase in .env file.';
      return rejectWithValue(error);
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to reset password');
      return rejectWithValue(errorMessage);
    }
  }
);
