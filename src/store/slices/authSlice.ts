import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types/user';
import { TokenData } from '@/types/auth';
import {
  logoutThunk,
  signInWithGoogleThunk,
  signInWithFacebookThunk,
  signInWithGitHubThunk,
  forgotPasswordThunk,
  loginWithFirebaseThunk,
  signUpWithFirebaseThunk,
  getUserProfileThunk,
} from '../thunks/authThunks';
import { TOKEN_STORAGE_KEYS } from '@/constants';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingProfile: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN),
  tokenExpiresAt: localStorage.getItem(TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT)
    ? parseInt(localStorage.getItem(TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT)!)
    : null,
  isAuthenticated: !!localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN),
  isLoading: false,
  isLoadingProfile: false,
  error: null,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const persistTokens = (tokens: TokenData, expiresAt: number) => {
  localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  localStorage.setItem(
    TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT,
    expiresAt.toString()
  );
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT);
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.error = null;
      clearTokens();
    },
    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    const setTokensInState = (state: AuthState, tokens: TokenData) => {
      const expiresAt = Date.now() + tokens.expiresIn * 1000;
      state.accessToken = tokens.accessToken;
      state.refreshToken = tokens.refreshToken;
      state.tokenExpiresAt = expiresAt;
      state.isAuthenticated = true;
      state.error = null;
      persistTokens(tokens, expiresAt);
    };

    // ── Email/password Login ─────────────────────────────────────────────────
    builder
      .addCase(loginWithFirebaseThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithFirebaseThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        setTokensInState(state, action.payload.tokens);
      })
      .addCase(loginWithFirebaseThunk.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload !== 'email_not_verified') {
          state.error = action.payload || 'Login failed';
        }
        state.isAuthenticated = false;
      });

    // ── Email/password Sign-up ───────────────────────────────────────────────
    builder
      .addCase(signUpWithFirebaseThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithFirebaseThunk.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(signUpWithFirebaseThunk.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload !== 'email_not_verified') {
          state.error = action.payload || 'Sign up failed';
        }
        state.isAuthenticated = false;
      });

    // ── Logout ───────────────────────────────────────────────────────────────
    builder
      .addCase(logoutThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.isAuthenticated = false;
        state.error = null;
        clearTokens();
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Logout failed';
      });

    // ── Google Sign In ───────────────────────────────────────────────────────
    builder
      .addCase(signInWithGoogleThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogleThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        setTokensInState(state, action.payload.tokens);
      })
      .addCase(signInWithGoogleThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Google sign in failed';
      });

    // ── Facebook Sign In ─────────────────────────────────────────────────────
    builder
      .addCase(signInWithFacebookThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithFacebookThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        setTokensInState(state, action.payload.tokens);
      })
      .addCase(signInWithFacebookThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Facebook sign in failed';
      });

    // ── GitHub Sign In ───────────────────────────────────────────────────────
    builder
      .addCase(signInWithGitHubThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGitHubThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        setTokensInState(state, action.payload.tokens);
      })
      .addCase(signInWithGitHubThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'GitHub sign in failed';
      });

    // ── Forgot Password ──────────────────────────────────────────────────────
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

    // ── Get User Profile ─────────────────────────────────────────────────────
    builder
      .addCase(getUserProfileThunk.pending, state => {
        state.isLoadingProfile = true;
      })
      .addCase(getUserProfileThunk.fulfilled, (state, action) => {
        state.isLoadingProfile = false;
        if (action.payload.data) {
          state.user = action.payload.data;
        }
      })
      .addCase(getUserProfileThunk.rejected, state => {
        state.isLoadingProfile = false;
      });
  },
});

export const { updateAccessToken, setError, logout, updateUser, clearError } =
  authSlice.actions;

export default authSlice.reducer;
