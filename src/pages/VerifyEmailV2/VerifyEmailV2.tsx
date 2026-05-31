import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import toast from 'react-hot-toast';
import { LuMailCheck } from 'react-icons/lu';
import { auth } from '@/config/firebase';
import { authService } from '@/services/authService';
import { IllustrationSection } from '@/pages/LoginV2/sections/IllustrationSection';
import {
  getPendingVerificationEmail,
  setPendingVerificationEmail,
} from '@/utils/authSession';

type VerifyEmailLocationState = {
  email?: string;
};

function resolveVerificationEmail(
  locationState?: VerifyEmailLocationState | null
): string | null {
  return (
    locationState?.email ??
    getPendingVerificationEmail() ??
    auth?.currentUser?.email ??
    null
  );
}

export default function VerifyEmailV2() {
  const location = useLocation();
  const locationState = location.state as VerifyEmailLocationState | null;
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (locationState?.email) {
      setPendingVerificationEmail(locationState.email);
    }
  }, [locationState?.email]);

  const handleResend = async () => {
    const email = resolveVerificationEmail(locationState);
    if (!email) {
      toast.error(
        'Unable to find your email. Please log in or register again.'
      );
      return;
    }

    setIsResending(true);
    try {
      await authService.sendVerificationEmail(email);
      toast.success('Verification email resent successfully!');
    } catch (error: unknown) {
      toast.error('Failed to resend verification email.');
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white font-sans overflow-hidden">
      <div className="flex flex-col items-center justify-center px-4 flex-1 w-full h-full bg-white relative">
        <div className="flex flex-col items-center gap-2 w-full py-16 max-w-[500px]">
          <div className="flex flex-col items-center w-full space-y-6 mt-4 text-center">
            <h1 className="text-h1-semi text-gray-900 tracking-tight leading-none">
              Verify your email
            </h1>

            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <LuMailCheck className="w-12 h-12 text-[#5B3EE5]" />
            </div>

            <p className="text-gray-500 text-sm leading-relaxed pb-4 px-8">
              We just sent you a verification link. Please check your email and
              click the link to activate your account.
            </p>

            <Link
              to={ROUTES.LOGIN}
              className="w-[400px] py-3 mt-2 bg-white border border-[#5B3EE5] hover:bg-gray-50 transition-all rounded-full text-[#5B3EE5] text-sm flex justify-center items-center font-medium"
            >
              I have already verified
            </Link>

            <div className="flex items-center justify-center gap-1 mt-6 text-sm">
              <span className="text-gray-800">Didn't receive the email?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#5B3EE5] hover:underline disabled:opacity-70 disabled:hover:no-underline font-medium"
              >
                {isResending ? 'Resending...' : 'Click to resend'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <IllustrationSection />
    </div>
  );
}
