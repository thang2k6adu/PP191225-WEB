import { LoginFormSection } from './sections/LoginFormSection';
import { IllustrationSection } from './sections/IllustrationSection';

export default function LoginV2() {
  return (
    <div className="flex h-screen w-screen bg-white font-sans overflow-hidden">
      <LoginFormSection />
      <IllustrationSection />
    </div>
  );
}
