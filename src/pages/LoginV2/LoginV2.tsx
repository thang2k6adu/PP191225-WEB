import { LoginFormSection } from './sections/LoginFormSection';
import { IllustrationSection } from './sections/IllustrationSection';

export default function LoginV2() {
  return (
    <div className="flex w-[1512px] h-[982px] items-start px-8 py-0 relative bg-white">
      <LoginFormSection />
      <IllustrationSection />
    </div>
  );
}
