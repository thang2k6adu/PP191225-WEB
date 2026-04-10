import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgotPasswordThunk } from '@/store/thunks/authThunks';
import { useState } from 'react';
import { LuCircleCheck } from 'react-icons/lu';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordFormSection() {
  const dispatch = useAppDispatch();
  const { isLoading: authLoading } = useAppSelector(state => state.auth);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setFirebaseError(null);
    try {
      await dispatch(forgotPasswordThunk(data.email)).unwrap();
      toast.success('Password reset email sent!');
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      const errorMessage =
        typeof err === 'string' ? err : 'Failed to send reset email';
      setFirebaseError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 flex-1 w-full h-full bg-white relative">
      <div className="flex flex-col items-center gap-2 w-full py-16 max-w-[500px]">
        {isSuccess ? (
          <div className="flex flex-col items-center w-full space-y-6 mt-4 text-center">
            <h1 className="text-h1-semi text-gray-900 tracking-tight leading-none">
              Check your email
            </h1>

            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <LuCircleCheck className="w-12 h-12 text-green-500" />
            </div>

            <p className="text-gray-500 text-sm leading-relaxed pb-4">
              Password reset link has been sent to your email. Please check your
              inbox and follow the instructions to set a new password.
            </p>

            <Link
              to={ROUTES.LOGIN}
              className="w-[400px] py-3 mt-2 bg-[#5B3EE5] hover:bg-opacity-90 transition-all rounded-full text-white text-sm flex justify-center items-center shadow-md shadow-[#5B3EE5]/20 font-medium"
            >
              Return to Sign In
            </Link>

            <div className="flex items-center gap-1 mt-6 text-sm">
              <span className="text-gray-800">Didn't receive the email?</span>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={authLoading}
                className="text-[#5B3EE5] hover:underline disabled:opacity-70 disabled:hover:no-underline"
              >
                Click to resend
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full space-y-9 mt-4 text-center">
            <h1 className="text-h1-semi text-gray-900 tracking-tight leading-none">
              Reset password
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

              <div className="flex flex-col w-full space-y-4">
                <div className="relative flex flex-col">
                  <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-gray-300 bg-white focus-within:border-[#5B3EE5] focus-within:ring-1 focus-within:ring-[#5B3EE5] transition-all">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      {...register('email')}
                      className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[10px] text-red-500 absolute -bottom-4 left-4">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 mt-2 bg-[#5B3EE5] hover:bg-opacity-90 disabled:opacity-70 transition-all rounded-full text-white text-sm flex justify-center items-center shadow-md shadow-[#5B3EE5]/20 font-medium"
              >
                {authLoading ? 'Sending...' : 'Next'}
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
