import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { SOCIAL_PROVIDERS } from '../constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginFormSection() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Login data:', data);
      toast.success('Login successful!');
      navigate(ROUTES.V2.HOME);
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full bg-white relative">
      <div className="flex flex-col items-center gap-2 w-full py-16 max-w-[540px] max-h-[1000px]">
        <div className="flex flex-col items-center w-full space-y-9 mt-4">
          <div className="flex flex-col items-center text-center space-y-4">
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
            className="flex flex-col w-full space-y-6"
          >
            <div className="flex flex-col w-full space-y-4">
              <div className="flex flex-col w-full space-y-4">
                <div className="relative flex flex-col">
                  <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-gray-300 bg-white focus-within:border-[#5B3EE5] focus-within:ring-1 focus-within:ring-[#5B3EE5] transition-all">
                    <input
                      type="text"
                      placeholder="Username"
                      {...register('username')}
                      className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                    />
                  </div>
                  {errors.username && (
                    <span className="text-[10px] text-red-500 absolute -bottom-4 left-4">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="relative flex flex-col">
                  <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-gray-300 bg-white focus-within:border-[#5B3EE5] focus-within:ring-1 focus-within:ring-[#5B3EE5] transition-all">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
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
                    <span className="text-[10px] text-red-500 absolute -bottom-4 left-4">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end w-full pt-1">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-body-regular text-gray-700 hover:text-[#5B3EE5] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-[#5B3EE5] hover:bg-opacity-90 disabled:opacity-70 transition-all rounded-full text-white text-body-regular flex justify-center items-center shadow-md shadow-[#5B3EE5]/20"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center w-full px-2 pt-2">
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
                aria-label={provider.label}
                className="flex items-center justify-center w-12 h-12 bg-[#5B3EE5] hover:bg-opacity-90 transition-opacity rounded-full shadow-md text-white"
              >
                {/* Override size slightly to fit nicely within a flex circle */}
                <div className="scale-90 flex items-center justify-center">
                  {provider.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer / Register */}
        <div className="flex items-center gap-1 mt-auto pt-10">
          <span className="text-gray-800 text-body-regular">Not a member?</span>
          <Link
            to={ROUTES.SIGNUP}
            className="text-[#5B3EE5] text-body-regular hover:underline"
          >
            Register now!
          </Link>
        </div>
      </div>
    </div>
  );
}
