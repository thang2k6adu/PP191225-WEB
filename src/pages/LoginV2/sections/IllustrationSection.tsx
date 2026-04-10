import { useState, useEffect } from 'react';

const CAROUSEL_ITEMS = [
  {
    image: '/illustrators/work-together.svg',
    text: 'Make your work easier and organized with Focushub',
  },
  {
    image: '/illustrators/online_meeting.svg',
    text: 'Collaborate seamlessly with your team from anywhere',
  },
  {
    image: '/illustrators/distraction.svg',
    text: 'Turn distractions into focused, meaningful progress',
  },
];

export function IllustrationSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex flex-1 p-6 items-center justify-center w-full min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center pt-8 pb-16 w-full h-full bg-[#F8F6FC] rounded-[40px] overflow-hidden relative border border-gray-50/50">
        <div className="flex flex-col items-center justify-center w-full max-w-[500px]">
          <div className="relative w-full h-[420px] mb-10 overflow-hidden">
            <div
              className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {CAROUSEL_ITEMS.map((item, index) => (
                <div
                  key={item.image}
                  className="w-full h-full flex-shrink-0 flex items-center justify-center px-8"
                >
                  <img
                    src={item.image}
                    alt={`Illustration ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 w-full mt-4">
            <div className="flex items-center gap-2">
              {CAROUSEL_ITEMS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    index === activeIndex
                      ? 'w-6 bg-gray-600'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Đi tới trang ${index + 1}`}
                />
              ))}
            </div>

            <div className="relative w-full overflow-hidden">
              <div
                className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {CAROUSEL_ITEMS.map(item => (
                  <div
                    key={item.text}
                    className="w-full h-full flex-shrink-0 flex items-start justify-center px-6"
                  >
                    <p className="w-full text-gray-500 text-center text-h5-regular leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
