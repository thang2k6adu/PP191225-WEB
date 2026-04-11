import { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from './components/LoadingSpinner';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useMatchmaking } from './hooks/useMatchmaking';
import { routes } from './routes';

function App() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { connect, disconnect, isConnected, isConnecting } = useMatchmaking();
  const element = useRoutes(routes);

  // Connect to matchmaking socket when user is authenticated - eager connection
  useEffect(() => {
    if (isAuthenticated && !isConnected && !isConnecting) {
      console.log('[App] User authenticated, connecting to matchmaking...');

      connect().catch(error => {
        console.error('[App] Failed to connect matchmaking socket:', error);
      });
    }

    return () => {
      if (isAuthenticated && isConnected) {
        console.log('[App] Cleaning up matchmaking connection...');
        disconnect();
      }
    };
  }, [isAuthenticated, isConnected, isConnecting, connect, disconnect]);

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
