import { RegisterFormSection } from './sections/RegisterFormSection';
import { IllustrationSection } from '../LoginV2/sections/IllustrationSection';

export default function RegisterV2() {
  return (
    <div className="flex h-screen w-screen bg-white font-sans overflow-hidden">
      <RegisterFormSection />
      <IllustrationSection />
    </div>
  );
}
