import { ForgotPasswordFormSection } from './sections/ForgotPasswordFormSection';
import { IllustrationSection } from '@/pages/LoginV2/sections/IllustrationSection';

export default function ForgotPasswordV2() {
  return (
    <div className="flex h-screen w-screen bg-white font-sans overflow-hidden">
      <ForgotPasswordFormSection />
      <IllustrationSection />
    </div>
  );
}
