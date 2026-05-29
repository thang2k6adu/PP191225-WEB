import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserProfileThunk } from '@/store/thunks/authThunks';
import { ROUTES } from '@/constants';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'user' | 'basic';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, isLoadingProfile, user } = useAppSelector(
    state => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserProfileThunk());
    }
  }, [isAuthenticated, dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isLoadingProfile && !user) {
    return <LoadingSpinner />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
