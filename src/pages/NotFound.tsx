import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { MeshGradientBackground } from '@/layout/MeshGradientBackground';

const outlineButtonClass =
  'inline-flex items-center justify-center border border-black bg-white px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Coming Soon | Focushub</title>
        <meta
          name="description"
          content="This page is not available yet. Great things are coming soon."
        />
      </Helmet>

      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#fcfcfb] font-[Poppins,sans-serif] text-black">
        <MeshGradientBackground />

        <div className="relative flex min-h-screen flex-col">
          <header className="pt-10 text-center sm:pt-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-black">
              Focushub
            </p>
          </header>

          <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8 text-center sm:px-10">
            <h1 className="max-w-4xl text-[2.5rem] font-semibold leading-[1.15] tracking-[-0.02em] text-black sm:text-5xl md:text-[3.25rem]">
              Great things coming soon.
            </h1>
            <p className="mt-6 max-w-xl text-base font-normal leading-relaxed text-black sm:text-lg">
              We&apos;re building better tools to help you focus, plan, and get
              work done.
            </p>
            <Link to={ROUTES.HOME} className={`mt-10 ${outlineButtonClass}`}>
              Back to home &rarr;
            </Link>
          </main>
        </div>
      </div>
    </>
  );
};

export default NotFound;
