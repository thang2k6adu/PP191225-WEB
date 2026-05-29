import React, { useEffect } from 'react';
import CollapsibleSidebar from '@/layout/CollapsibleSidebar';
import { MeshGradientBackground } from '@/layout/MeshGradientBackground';
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
    <div className="relative flex h-screen w-full overflow-hidden bg-[#fcfcfb]">
      <MeshGradientBackground />

      <div className="relative z-10 flex h-screen w-full min-h-0">
        <CollapsibleSidebar />

        <main className="relative flex min-h-0 flex-1 flex-col">
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
          <section className="grid flex-1 grid-cols-1 gap-8 overflow-auto p-8 lg:grid-cols-12">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};
