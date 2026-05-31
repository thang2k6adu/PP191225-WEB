import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPasswordThunk } from '@/store/thunks/authThunks';
import { LuEye, LuEyeOff, LuCircleCheck } from 'react-icons/lu';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
} from '@/constants/password';
import { FORM_ERROR_MESSAGES } from '@/constants';

const resetPasswordSchema = z
  .object({
    password: z.string().min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: FORM_ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordFormSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const dispatch = useAppDispatch();
  const { isLoading: authLoading } = useAppSelector(state => state.auth);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!oobCode) {
      toast.error(FORM_ERROR_MESSAGES.INVALID_OR_MISSING_ACTION_CODE);
      return;
    }

    setFirebaseError(null);
    try {
      await dispatch(
        resetPasswordThunk({ oobCode, newPassword: data.password })
      ).unwrap();
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      const errorMessage =
        typeof err === 'string'
          ? err
          : FORM_ERROR_MESSAGES.RESET_PASSWORD_FAILED;
      setFirebaseError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 flex-1 w-full h-full bg-white relative">
      <div className="flex flex-col items-center gap-2 w-full py-16 max-w-[400px]">
        {isSuccess ? (
          <div className="flex flex-col items-center w-full space-y-6 mt-4 text-center">
            <h1 className="text-h2-semi text-gray-900 tracking-tight leading-none">
              Password Changed
            </h1>

            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <LuCircleCheck className="w-12 h-12 text-green-500" />
            </div>

            <p className="text-gray-500 text-sm leading-relaxed pb-4">
              Your password has been successfully updated. You can now use your
              new password to sign in to your account.
            </p>

            <Link
              to={ROUTES.LOGIN}
              className="w-full py-3 mt-2 bg-[#5B3EE5] hover:bg-opacity-90 transition-all rounded-full text-white text-sm flex justify-center items-center shadow-md shadow-[#5B3EE5]/20 font-medium"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full space-y-9 mt-4 text-center">
            <h1 className="text-h1-semi text-gray-900 tracking-tight leading-none">
              Reset Password
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full space-y-6"
            >
              {firebaseError && (
                <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md text-sm text-center">
                  {firebaseError}
                </div>
              )}
              {!oobCode && !firebaseError && (
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-md text-sm text-center">
                  Missing verification code in URL. You may need to click the
                  link in your email again.
                </div>
              )}

              <div className="flex flex-col w-full space-y-4">
                <div className="relative flex flex-col">
                  <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-gray-300 bg-white focus-within:border-[#5B3EE5] focus-within:ring-1 focus-within:ring-[#5B3EE5] transition-all">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New Password"
                      {...register('password')}
                      className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="flex-shrink-0 ml-2 focus:outline-none"
                    >
                      {showPassword ? (
                        <LuEye className="w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors" />
                      ) : (
                        <LuEyeOff className="w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-xs text-red-500 absolute -bottom-6 left-4">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="relative flex flex-col pt-2">
                  <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-gray-300 bg-white focus-within:border-[#5B3EE5] focus-within:ring-1 focus-within:ring-[#5B3EE5] transition-all">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm New Password"
                      {...register('confirmPassword')}
                      className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                    />
                    <button
                      type="button"
                      aria-label="Toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      className="flex-shrink-0 ml-2 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <LuEye className="w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors" />
                      ) : (
                        <LuEyeOff className="w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-xs text-red-500 absolute -bottom-6 left-4">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading || !oobCode}
                className="w-full py-3 mt-2 bg-[#5B3EE5] hover:bg-opacity-90 disabled:opacity-70 transition-all rounded-full text-white text-sm flex justify-center items-center shadow-md shadow-[#5B3EE5]/20 font-medium"
              >
                {authLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="flex items-center gap-1 mt-2 text-xs md:text-sm">
              <span className="text-gray-800">Remember your password?</span>
              <Link
                to={ROUTES.LOGIN}
                className="text-[#5B3EE5] hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
