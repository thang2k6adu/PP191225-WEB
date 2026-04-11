import { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from './components/LoadingSpinner';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useMatchmaking } from './hooks/useMatchmaking';
import { matchmakingService } from './services/matchmakingService';
import { routes } from './routes';

function App() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { connect, disconnect, isConnected, isConnecting } = useMatchmaking();
  const element = useRoutes(routes);

  useEffect(() => {
    if (
      !isAuthenticated ||
      isConnected ||
      isConnecting ||
      matchmakingService.hasSocket()
    ) {
      return;
    }

    console.log('[App] User authenticated, connecting to matchmaking...');
    connect().catch(error => {
      console.error('[App] Failed to connect matchmaking socket:', error);
    });
  }, [isAuthenticated, isConnected, isConnecting, connect]);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    disconnect();
  }, [isAuthenticated, disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

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
