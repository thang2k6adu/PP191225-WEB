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
  TokenData,
} from '@/types/auth';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import type { ApiResponse } from '@/types/common/api';
import { UserProfile } from '@/types/user';
import { apiFailureMessage } from '@/utils/apiEnvelope';
import {
  clearPendingVerificationEmail,
  setPendingVerificationEmail,
} from '@/utils/authSession';

interface TokensPayload {
  tokens: TokenData;
}

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  const errorObj = error as { code?: string; message?: string };
  if (errorObj?.code === 'auth/invalid-credential')
    return 'Invalid email or password';
  if (errorObj?.code === 'auth/email-already-in-use')
    return 'Email already in use';
  if (errorObj?.code === 'auth/user-not-found') return 'User not found';
  if (errorObj?.code === 'auth/account-exists-with-different-credential')
    return 'An account with this email already exists with a different sign-in method. Please use your original sign-in method.';
  if (errorObj?.code === 'auth/popup-blocked')
    return 'Sign-in popup was blocked. Please allow popups and try again.';
  if (errorObj?.code === 'auth/popup-closed-by-user')
    return 'Sign-in popup was closed. Please try again.';
  if (errorObj?.code === 'auth/cancelled-popup-request')
    return 'Sign-in was cancelled. Please try again.';
  return errorObj?.message || defaultMessage;
};

const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `web_${navigator.userAgent.split(' ').pop()}_${Date.now()}`;
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

const exchangeFirebaseToken = async (idToken: string) => {
  const loginRequest: FirebaseLoginRequest = {
    idToken,
    deviceId: getDeviceId(),
    platform: 'web',
  };
  const response = await authService.loginWithFirebase(loginRequest);
  if (response.error || !response.data) {
    throw new Error(response.message || 'Backend authentication failed');
  }
  return response.data.tokens;
};

const clearFirebaseSession = async () => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch {
    // Best-effort cleanup. Backend JWT is the real app session.
  }
};

export const loginWithFirebaseThunk = createAsyncThunk<
  TokensPayload,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginWithFirebase', async (credentials, { rejectWithValue }) => {
  if (!auth) return rejectWithValue('Firebase is not configured.');

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    if (!userCredential.user.emailVerified) {
      setPendingVerificationEmail(credentials.email);
      await authService.sendVerificationEmail(credentials.email);
      await clearFirebaseSession();
      return rejectWithValue('email_not_verified');
    }

    const idToken = await userCredential.user.getIdToken();
    const tokens = await exchangeFirebaseToken(idToken);
    await clearFirebaseSession();
    clearPendingVerificationEmail();
    return { tokens };
  } catch (error: unknown) {
    await clearFirebaseSession();
    return rejectWithValue(getErrorMessage(error, 'Login failed'));
  }
});

export const signUpWithFirebaseThunk = createAsyncThunk<
  void,
  { email: string; password: string; firstName?: string; lastName?: string },
  { rejectValue: string }
>('auth/signUpWithFirebase', async (credentials, { rejectWithValue }) => {
  if (!auth) return rejectWithValue('Firebase is not configured.');

  try {
    await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // Pass firstName/lastName so the backend creates the user record in DB right now.
    // When the user verifies email and logs in, the name is already saved — no need
    // to carry it around in Redux state.
    setPendingVerificationEmail(credentials.email);
    await authService.sendVerificationEmail(credentials.email, {
      firstName: credentials.firstName,
      lastName: credentials.lastName,
    });

    await clearFirebaseSession();
    return rejectWithValue('email_not_verified');
  } catch (error: unknown) {
    await clearFirebaseSession();
    return rejectWithValue(getErrorMessage(error, 'Sign up failed'));
  }
});

/** Sign out from Firebase and clear local tokens. */
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    if (auth) await signOut(auth);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Logout failed'));
  }
});

export const signInWithGoogleThunk = createAsyncThunk<
  TokensPayload,
  void,
  { rejectValue: string }
>('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
  if (!auth) return rejectWithValue('Firebase is not configured.');

  try {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    const idToken = await user.getIdToken();
    const tokens = await exchangeFirebaseToken(idToken);
    await clearFirebaseSession();
    return { tokens };
  } catch (error: unknown) {
    await clearFirebaseSession();
    return rejectWithValue(getErrorMessage(error, 'Google sign in failed'));
  }
});

/** Facebook OAuth → Firebase popup → exchange idToken → backend JWT. */
export const signInWithFacebookThunk = createAsyncThunk<
  TokensPayload,
  void,
  { rejectValue: string }
>('auth/signInWithFacebook', async (_, { rejectWithValue }) => {
  if (!auth) return rejectWithValue('Firebase is not configured.');

  try {
    const provider = new FacebookAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    const idToken = await user.getIdToken();
    const tokens = await exchangeFirebaseToken(idToken);
    await clearFirebaseSession();
    return { tokens };
  } catch (error: unknown) {
    await clearFirebaseSession();
    return rejectWithValue(getErrorMessage(error, 'Facebook sign in failed'));
  }
});

/** GitHub OAuth → Firebase popup → exchange idToken → backend JWT. */
export const signInWithGitHubThunk = createAsyncThunk<
  TokensPayload,
  void,
  { rejectValue: string }
>('auth/signInWithGitHub', async (_, { rejectWithValue }) => {
  if (!auth) return rejectWithValue('Firebase is not configured.');

  try {
    const provider = new GithubAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    const idToken = await user.getIdToken();
    const tokens = await exchangeFirebaseToken(idToken);
    await clearFirebaseSession();
    return { tokens };
  } catch (error: unknown) {
    await clearFirebaseSession();
    return rejectWithValue(getErrorMessage(error, 'GitHub sign in failed'));
  }
});

/** Send a password-reset link via the backend. */
export const forgotPasswordThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    await authService.forgotPassword(email);
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorMessage(error, 'Failed to send reset email')
    );
  }
});

/** Confirm a Firebase password-reset using the oobCode from the email link. */
export const resetPasswordThunk = createAsyncThunk<
  void,
  { oobCode: string; newPassword: string },
  { rejectValue: string }
>(
  'auth/resetPassword',
  async ({ oobCode, newPassword }, { rejectWithValue }) => {
    if (!auth) return rejectWithValue('Firebase is not configured.');

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to reset password')
      );
    }
  }
);

export const getUserProfileThunk = createAsyncThunk<
  ApiResponse<UserProfile>,
  void,
  { rejectValue: string }
>('auth/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await userService.getProfile();
    if (res.error || !res.data) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error: unknown) {
    const err = error as { message?: string };
    return rejectWithValue(err?.message || 'Failed to fetch user profile');
  }
});

export const loginThunk = createAsyncThunk<
  { tokens: TokenData },
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  if (!auth) return rejectWithValue('Firebase is not configured.');
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    const idToken = await userCredential.user.getIdToken();
    const tokens = await exchangeFirebaseToken(idToken);
    await clearFirebaseSession();
    return { tokens };
  } catch (error: unknown) {
    await clearFirebaseSession();
    return rejectWithValue(getErrorMessage(error, 'Login failed'));
  }
});

export const signUpThunk = createAsyncThunk<
  void,
  SignUpCredentials,
  { rejectValue: string }
>('auth/signUp', async (credentials, { rejectWithValue }) => {
  if (!auth) return rejectWithValue('Firebase is not configured.');
  try {
    await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    await authService.sendVerificationEmail(credentials.email);
    await clearFirebaseSession();
    return rejectWithValue('email_not_verified');
  } catch (error: unknown) {
    await clearFirebaseSession();
    return rejectWithValue(getErrorMessage(error, 'Sign up failed'));
  }
});
