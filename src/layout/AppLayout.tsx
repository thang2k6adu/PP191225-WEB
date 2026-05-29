import React from 'react';
import CollapsibleSidebar from '@/layout/CollapsibleSidebar';
import { MeshGradientBackground } from '@/layout/MeshGradientBackground';
import { Header } from '@/layout/Header.tsx';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { getDisplayName, getInitials } from '@/types/user';

export const Layout: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);

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
                    exp: user.exp ?? 0,
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
