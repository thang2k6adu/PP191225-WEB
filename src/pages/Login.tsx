import React, { useState } from 'react';
import { JSX } from 'react';

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#666666"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="absolute top-[12.47%] left-[3.12%]"
    style={{ width: '96.88%', height: '87.53%' }}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const EyeOnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="16"
    viewBox="0 0 22 16"
    fill="none"
    className="absolute top-[12.47%] left-[3.12%]"
    style={{ width: '96.88%', height: '87.53%' }}
  >
    <path
      d="M11 0C6 0 1.73 3.11 0 7.5 1.73 11.89 6 15 11 15s9.27-3.11 11-7.5C20.27 3.11 16 0 11 0zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      fill="#666666"
    />
  </svg>
);

const socialProviders = [
  { id: 'google', icon: <GoogleIcon />, label: 'Sign in with Google' },
  { id: 'facebook', icon: <FacebookIcon />, label: 'Sign in with Facebook' },
  { id: 'apple', icon: <AppleIcon />, label: 'Sign in with Apple' },
];

export default function Login(): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex w-[1512px] h-[982px] items-start px-8 py-0 relative bg-white">
      <div className="flex flex-col items-center justify-around gap-8 px-[94px] py-16 relative flex-1 self-stretch grow">
        <div className="flex flex-col items-center justify-between relative flex-1 self-stretch w-full grow">
          <div className="flex flex-col h-[572px] items-center gap-10 pt-8 pb-0 px-0 relative self-stretch w-full">
            <div className="inline-flex flex-col items-center gap-4 relative flex-[0_0_auto]">
              <h1 className="relative w-fit mt-[-1.00px] font-semibold-heading-h1-semibold font-[number:var(--semibold-heading-h1-semibold-font-weight)] text-black text-[length:var(--semibold-heading-h1-semibold-font-size)] tracking-[var(--semibold-heading-h1-semibold-letter-spacing)] leading-[var(--semibold-heading-h1-semibold-line-height)] whitespace-nowrap [font-style:var(--semibold-heading-h1-semibold-font-style)]">
                Welcome back!
              </h1>

              <p className="relative w-[474px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-[#666666] text-[length:var(--regular-body-base-regular-font-size)] text-center tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] [font-style:var(--regular-body-base-regular-font-style)]">
                Turn distractions into meaningful progress every single day with
                Focushub.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="flex flex-col items-center justify-center gap-6 relative self-stretch w-full flex-[0_0_auto]"
            >
              <div className="flex flex-col items-end justify-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex items-start gap-2.5 p-4 relative self-stretch w-full flex-[0_0_auto] rounded-[32px] overflow-hidden border border-solid border-[#666666]">
                      <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                        aria-label="Username"
                        className="relative w-full mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-[#666666] text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)] bg-transparent border-0 outline-none appearance-none placeholder-[#666666]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 relative self-stretch w-full flex-[0_0_auto] rounded-[32px] overflow-hidden border border-solid border-[#666666]">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        aria-label="Password"
                        className="relative w-full mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-[#666666] text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)] bg-transparent border-0 outline-none appearance-none placeholder-[#666666]"
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        onClick={() => setShowPassword(prev => !prev)}
                        className="relative w-6 h-6 flex-shrink-0 bg-transparent border-0 outline-none cursor-pointer p-0"
                      >
                        {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="relative w-fit font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-black text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)] bg-transparent border-0 outline-none cursor-pointer p-0"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="all-[unset] box-border flex items-center justify-center gap-2.5 p-4 relative self-stretch w-full flex-[0_0_auto] bg-primary-900 rounded-[32px] cursor-pointer"
              >
                <span className="relative w-fit mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-white text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)]">
                  Login
                </span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-8 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative flex-1 grow h-px bg-white border-t [border-top-style:solid] border-[#666666]" />

              <div className="relative w-fit mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-black text-[length:var(--regular-body-base-regular-font-size)] text-center tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)]">
                or continue with
              </div>

              <div className="relative flex-1 grow h-px bg-white border-t [border-top-style:solid] border-[#666666]" />
            </div>

            <div className="inline-flex items-center gap-8 relative flex-[0_0_auto] mb-[-38.00px]">
              {socialProviders.map(provider => (
                <button
                  key={provider.id}
                  type="button"
                  aria-label={provider.label}
                  className="inline-flex items-center gap-2.5 p-5 relative flex-[0_0_auto] bg-primary-900 rounded-[64px] overflow-hidden cursor-pointer border-0 outline-none"
                >
                  {provider.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
            <span className="relative w-fit mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-black text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)]">
              Not a member?
            </span>

            <button
              type="button"
              className="relative w-fit mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-primary-900 text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)] bg-transparent border-0 outline-none cursor-pointer p-0"
            >
              Register now!
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2.5 p-9 relative flex-1 self-stretch grow">
        <div className="flex flex-col items-center justify-between px-10 py-[120px] relative flex-1 self-stretch w-full grow bg-primary-700 rounded-[32px] opacity-60">
          <img
            className="relative w-[540px] h-[451.38px] aspect-[1.2] object-cover"
            alt="Group illustration"
            src="https://placehold.co/540x451/E2E8F0/1E293B?text=Illustration"
          />

          <div className="flex flex-col items-center justify-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto]">
              <div className="relative w-2 h-2 bg-grayscale-300 rounded-[20px]" />
              <div className="relative w-2 h-2 bg-grayscale-300 rounded-[20px]" />
              <div className="relative w-5 h-2 bg-grayscaleblack rounded-[20px]" />
            </div>

            <p className="relative self-stretch font-regular-heading-h5-regular font-[number:var(--regular-heading-h5-regular-font-weight)] text-black text-[length:var(--regular-heading-h5-regular-font-size)] text-center tracking-[var(--regular-heading-h5-regular-letter-spacing)] leading-[var(--regular-heading-h5-regular-line-height)] [font-style:var(--regular-heading-h5-regular-font-style)]">
              Make your work easier and organized with Focushub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
