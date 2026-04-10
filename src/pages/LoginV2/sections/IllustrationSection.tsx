export function IllustrationSection() {
  return (
    <div className="hidden lg:flex flex-1 p-6 items-center justify-center w-full min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center pt-8 pb-16 w-full h-full bg-[#F8F6FC] rounded-[40px] overflow-hidden relative border border-gray-50/50">
        <div className="flex flex-col items-center justify-center w-full max-w-[500px]">
          {/* Main illustration */}
          <img
            className="w-full object-contain mb-10 px-8"
            alt="Group illustration connecting work and productivity"
            src="https://placehold.co/540x451/F8F6FC/1E293B?text=Illustration"
            onError={e => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/540x451/E2E8F0/1E293B?text=Illustration';
            }}
          />

          <div className="flex flex-col items-center justify-center gap-6 w-full mt-4">
            {/* Pagination dots */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <div className="w-4 h-1.5 bg-gray-600 rounded-full" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Subtext */}
            <p className="w-full max-w-[320px] text-[#666666] text-sm text-center font-medium leading-relaxed">
              Make your work easier and organized with Focushub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
