import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, FirebaseUserData, TokenData } from '@/types/auth';
import {
  loginThunk,
  signUpThunk,
  logoutThunk,
  signInWithGoogleThunk,
  signInWithFacebookThunk,
  signInWithGitHubThunk,
  forgotPasswordThunk,
  loginWithFirebaseThunk,
  signUpWithFirebaseThunk,
} from '../thunks/authThunks';
import { TOKEN_STORAGE_KEYS } from '@/constants';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUserData | null;
  token: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  firebaseUser: null,
  token: null,
  accessToken: localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN),
  tokenExpiresAt: localStorage.getItem(TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT)
    ? parseInt(localStorage.getItem(TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT)!)
    : null,
  isAuthenticated: !!localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    setFirebaseAuth: (
      state,
      action: PayloadAction<{
        user: FirebaseUserData;
        tokens: TokenData;
      }>
    ) => {
      state.firebaseUser = action.payload.user;
      state.accessToken = action.payload.tokens.accessToken;
      state.refreshToken = action.payload.tokens.refreshToken;
      state.tokenExpiresAt =
        Date.now() + action.payload.tokens.expiresIn * 1000;
      state.isAuthenticated = true;
      state.error = null;

      // Persist to localStorage
      localStorage.setItem(
        TOKEN_STORAGE_KEYS.ACCESS_TOKEN,
        action.payload.tokens.accessToken
      );
      localStorage.setItem(
        TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
        action.payload.tokens.refreshToken
      );
      localStorage.setItem(
        TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT,
        state.tokenExpiresAt.toString()
      );
    },
    updateAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string; expiresIn: number }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.tokenExpiresAt = Date.now() + action.payload.expiresIn * 1000;
      localStorage.setItem(
        TOKEN_STORAGE_KEYS.ACCESS_TOKEN,
        action.payload.accessToken
      );
      localStorage.setItem(
        TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT,
        state.tokenExpiresAt.toString()
      );
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: state => {
      state.user = null;
      state.firebaseUser = null;
      state.token = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Firebase Login thunk
    builder
      .addCase(loginWithFirebaseThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithFirebaseThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.firebaseUser = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.tokenExpiresAt =
          Date.now() + action.payload.tokens.expiresIn * 1000;
        state.isAuthenticated = true;
        state.error = null;

        // Persist tokens
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.ACCESS_TOKEN,
          action.payload.tokens.accessToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
          action.payload.tokens.refreshToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT,
          state.tokenExpiresAt.toString()
        );
      })
      .addCase(loginWithFirebaseThunk.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload !== 'email_not_verified') {
          state.error = action.payload || 'Firebase login failed';
        }
        state.isAuthenticated = false;
      });

    // Firebase Sign Up thunk
    builder
      .addCase(signUpWithFirebaseThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithFirebaseThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.firebaseUser = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.tokenExpiresAt =
          Date.now() + action.payload.tokens.expiresIn * 1000;
        state.isAuthenticated = true;
        state.error = null;

        // Persist tokens
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.ACCESS_TOKEN,
          action.payload.tokens.accessToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
          action.payload.tokens.refreshToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT,
          state.tokenExpiresAt.toString()
        );
      })
      .addCase(signUpWithFirebaseThunk.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload !== 'email_not_verified') {
          state.error = action.payload || 'Firebase sign up failed';
        }
        state.isAuthenticated = false;
      });

    // Login thunk
    builder
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // Sign up thunk
    builder
      .addCase(signUpThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Sign up failed';
      });

    // Logout thunk
    builder
      .addCase(logoutThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.firebaseUser = null;
        state.token = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT);
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Logout failed';
      });

    // Google sign in thunk (Firebase -> Backend tokens)
    builder
      .addCase(signInWithGoogleThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogleThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.firebaseUser = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.tokenExpiresAt =
          Date.now() + action.payload.tokens.expiresIn * 1000;
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem(
          TOKEN_STORAGE_KEYS.ACCESS_TOKEN,
          action.payload.tokens.accessToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
          action.payload.tokens.refreshToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT,
          state.tokenExpiresAt.toString()
        );
      })
      .addCase(signInWithGoogleThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Google sign in failed';
      });

    // Facebook sign in thunk (Firebase -> Backend tokens)
    builder
      .addCase(signInWithFacebookThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithFacebookThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.firebaseUser = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.tokenExpiresAt =
          Date.now() + action.payload.tokens.expiresIn * 1000;
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem(
          TOKEN_STORAGE_KEYS.ACCESS_TOKEN,
          action.payload.tokens.accessToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
          action.payload.tokens.refreshToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT,
          state.tokenExpiresAt.toString()
        );
      })
      .addCase(signInWithFacebookThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Facebook sign in failed';
      });

    // GitHub sign in thunk (Firebase -> Backend tokens)
    builder
      .addCase(signInWithGitHubThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGitHubThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.firebaseUser = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.tokenExpiresAt =
          Date.now() + action.payload.tokens.expiresIn * 1000;
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem(
          TOKEN_STORAGE_KEYS.ACCESS_TOKEN,
          action.payload.tokens.accessToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.REFRESH_TOKEN,
          action.payload.tokens.refreshToken
        );
        localStorage.setItem(
          TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT,
          state.tokenExpiresAt.toString()
        );
      })
      .addCase(signInWithGitHubThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'GitHub sign in failed';
      });

    // Forgot password thunk
    builder
      .addCase(forgotPasswordThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send reset email';
      });
  },
});

export const {
  setLoading,
  setAuth,
  setFirebaseAuth,
  updateAccessToken,
  setError,
  logout,
  updateUser,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
