import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Coming Soon</title>
        <meta
          name="description"
          content="This area is under construction and will be available soon."
        />
      </Helmet>
      <div className="relative min-h-[70vh] overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-14 dark:border-gray-800 dark:bg-gray-900 sm:px-10">
        <div className="pointer-events-none absolute -left-24 top-[-120px] h-64 w-64 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-900/30" />
        <div className="pointer-events-none absolute -right-24 bottom-[-120px] h-64 w-64 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-900/20" />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/60 dark:text-primary-300">
            Coming Soon
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            This feature is under construction
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
            The page you are looking for is not ready yet or has been moved. We
            are improving it and will release it soon.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
