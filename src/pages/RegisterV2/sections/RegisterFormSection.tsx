import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { SOCIAL_PROVIDERS } from '../../LoginV2/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signUpWithFirebaseThunk } from '@/store/thunks/authThunks';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterFormSection() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading: authLoading, error: authError } = useAppSelector(
    state => state.auth
  );
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const { signInWithGoogle, signInWithFacebook, signInWithGitHub } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setFirebaseError(null);
    try {
      const displayName = `${data.firstName} ${data.lastName}`.trim();
      await dispatch(
        signUpWithFirebaseThunk({
          email: data.email,
          password: data.password,
          displayName,
        })
      ).unwrap();

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const errorMessage =
        typeof err === 'string' ? err : 'Registration failed';
      setFirebaseError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleProviderClick = (id: string) => {
    switch (id) {
      case 'google':
        signInWithGoogle();
        break;
      case 'facebook':
        signInWithFacebook();
        break;
      case 'github':
        signInWithGitHub();
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full bg-white relative">
      <div className="flex flex-col items-center gap-2 w-full py-16 max-w-[540px] max-h-[1000px]">
        <div className="flex flex-col items-center w-full space-y-7 mt-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <h1 className="text-h1-semi font-semibold text-gray-900 tracking-tight leading-none">
              Welcome back!
            </h1>
            <p className="text-body-regular text-gray-500 leading-relaxed">
              Turn distractions into meaningful progress every single day with
              Focushub.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-5"
          >
            {(firebaseError || authError) && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
                {firebaseError || authError}
              </div>
            )}

            <div className="flex flex-col w-full space-y-3">
              <div className="flex w-full gap-4">
                <div className="relative flex flex-col flex-1">
                  <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-gray-300 bg-white focus-within:border-[#5B3EE5] focus-within:ring-1 focus-within:ring-[#5B3EE5] transition-all">
                    <input
                      type="text"
                      placeholder="First Name"
                      {...register('firstName')}
                      className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                    />
                  </div>
                  {errors.firstName && (
                    <span className="text-[10px] text-red-500 absolute -bottom-4 left-4">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>

                <div className="relative flex flex-col flex-1">
                  <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-gray-300 bg-white focus-within:border-[#5B3EE5] focus-within:ring-1 focus-within:ring-[#5B3EE5] transition-all">
                    <input
                      type="text"
                      placeholder="Last Name"
                      {...register('lastName')}
                      className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                    />
                  </div>
                  {errors.lastName && (
                    <span className="text-[10px] text-red-500 absolute -bottom-4 left-4">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative flex flex-col w-full">
                <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-gray-300 bg-white focus-within:border-[#5B3EE5] focus-within:ring-1 focus-within:ring-[#5B3EE5] transition-all">
                  <input
                    type="email"
                    placeholder="Email"
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

              <div className="relative flex flex-col w-full">
                <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-gray-300 bg-white focus-within:border-[#5B3EE5] focus-within:ring-1 focus-within:ring-[#5B3EE5] transition-all">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password')}
                    className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                  />
                  <button
                    type="button"
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
                  <span className="text-[10px] text-red-500 absolute -bottom-4 left-4">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="relative flex items-center pt-2 pl-2">
                <input
                  type="checkbox"
                  id="terms"
                  {...register('terms')}
                  className="w-4 h-4 text-[#5B3EE5] bg-gray-100 border-gray-300 rounded focus:ring-[#5B3EE5] cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-xs text-gray-600 font-medium cursor-pointer"
                >
                  I accept the Term of Use and Privacy Policy
                </label>
                {errors.terms && (
                  <span className="text-[10px] text-red-500 absolute -bottom-4 left-6">
                    {errors.terms.message}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 mt-2 bg-[#5B3EE5] hover:bg-opacity-90 disabled:opacity-70 transition-all rounded-full text-white text-body-regular flex justify-center items-center shadow-md shadow-[#5B3EE5]/20"
            >
              {authLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="flex items-center w-full px-2">
            <div className="flex-1 h-[1px] bg-gray-200" />
            <span className="px-4 text-body-regular text-gray-800">
              or continue with
            </span>
            <div className="flex-1 h-[1px] bg-gray-200" />
          </div>

          <div className="flex items-center justify-center gap-6">
            {SOCIAL_PROVIDERS.map(provider => (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleProviderClick(provider.id)}
                disabled={authLoading}
                className="flex items-center justify-center w-12 h-12 bg-[#5B3EE5] hover:bg-opacity-90 disabled:opacity-70 transition-opacity rounded-full shadow-md text-white"
              >
                <div className="scale-90 flex items-center justify-center">
                  {provider.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 mt-auto pt-6">
          <span className="text-gray-800 text-body-regular">
            Already a member?
          </span>
          <Link
            to="/v2/login"
            className="text-[#5B3EE5] text-body-regular hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
