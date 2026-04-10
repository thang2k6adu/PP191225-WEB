import React, { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { SOCIAL_PROVIDERS } from '../constants';

export function LoginFormSection() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
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
                      className="relative w-6 h-6 flex-shrink-0 bg-transparent border-0 outline-none cursor-pointer p-0 flex items-center justify-center"
                    >
                      {showPassword ? (
                        <LuEye className="w-5 h-5 text-[#666666]" />
                      ) : (
                        <LuEyeOff className="w-5 h-5 text-[#666666]" />
                      )}
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
            {SOCIAL_PROVIDERS.map(provider => (
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
  );
}
