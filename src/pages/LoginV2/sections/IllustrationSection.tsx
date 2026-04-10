export function IllustrationSection() {
  return (
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
  );
}
