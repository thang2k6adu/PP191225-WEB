export const FORM_ERROR_MESSAGES = {
  INVALID_EMAIL_ADDRESS: 'Invalid email address',
  FIRST_NAME_REQUIRED: 'First name is required',
  LAST_NAME_REQUIRED: 'Last name is required',
  ACCEPT_TERMS: 'You must accept the terms',
  PASSWORDS_DO_NOT_MATCH: "Passwords don't match",
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  CONFIRM_PASSWORD_MIN_LENGTH: 'Confirm password must be at least 8 characters',
  LOGIN_FAILED: 'Login failed',
  REGISTRATION_FAILED: 'Registration failed',
  RESET_PASSWORD_FAILED: 'Failed to reset password',
  FORGOT_PASSWORD_FAILED: 'Failed to send reset email',
  INVALID_OR_MISSING_ACTION_CODE:
    'Invalid or missing action code. Please request a new password reset link.',
  MISSING_RESET_CODE:
    'Missing verification code in URL. You may need to click the link in your email again.',
} as const;
