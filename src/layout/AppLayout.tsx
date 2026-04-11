import React, { useEffect } from 'react';
import CollapsibleSidebar from '@/layout/CollapsibleSidebar';
import { Header } from '@/layout/Header.tsx';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserProfileThunk } from '@/store/thunks/authThunks';
import { getDisplayName, getInitials } from '@/types/user';

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    console.log('user', user);

    if (isAuthenticated && !user) {
      dispatch(getUserProfileThunk());
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <div className="flex h-screen w-full">
      <CollapsibleSidebar />

      <main className="relative flex-1 flex flex-col">
        <Header
          user={
            user
              ? {
                  name: getDisplayName(user),
                  initials: getInitials(user),
                  role: user.role,
                  avatar: user.avatar ?? undefined,
                }
              : undefined
          }
        />
        <section className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-auto p-8 gap-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
