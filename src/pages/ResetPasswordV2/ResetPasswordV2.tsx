import { ResetPasswordFormSection } from './sections/ResetPasswordFormSection';
import { IllustrationSection } from '@/pages/LoginV2/sections/IllustrationSection';

export default function ResetPasswordV2() {
  return (
    <div className="flex h-screen w-screen bg-white font-sans overflow-hidden">
      <ResetPasswordFormSection />
      <IllustrationSection />
    </div>
  );
}
