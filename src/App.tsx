import { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import LoadingSpinner from './components/LoadingSpinner';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useSocketConnection } from './hooks/useSocketConnection';
import { reset } from './store/slices/matchmakingSlice';
import { routes } from './routes';
import type { AppDispatch } from './store';

function App() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  useSocketConnection();
  const element = useRoutes(routes);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    dispatch(reset());
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <Helmet>
        <html lang="en" className={theme} />
      </Helmet>
      <Suspense fallback={<LoadingSpinner />}>{element}</Suspense>
    </>
  );
}

export default App;
