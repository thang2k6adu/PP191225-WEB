import React from 'react';
import CollapsibleSidebar from '@/layout/CollapsibleSidebar';
import { Header } from '@/layout/Header.tsx';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export const Layout: React.FC = () => {
  const { user, firebaseUser } = useAppSelector(state => state.auth);
  const displayUser = user || firebaseUser;

  const getUserName = (): string => {
    if (!displayUser) return 'Guest';
    if ('displayName' in displayUser && displayUser.displayName)
      return displayUser.displayName as string;
    if ('firstName' in displayUser && displayUser.firstName) {
      const lastName =
        'lastName' in displayUser && displayUser.lastName
          ? displayUser.lastName
          : '';
      return `${displayUser.firstName} ${lastName}`.trim();
    }
    return 'Guest';
  };

  const getAvatar = (): string | undefined => {
    if (!displayUser) return undefined;
    if ('photoURL' in displayUser && typeof displayUser.photoURL === 'string')
      return displayUser.photoURL;
    if ('avatar' in displayUser && typeof displayUser.avatar === 'string')
      return displayUser.avatar;
    return undefined;
  };

  return (
    <div className="flex h-screen w-full">
      <CollapsibleSidebar />

      <main className="relative flex-1 flex flex-col">
        <Header
          user={{
            name: getUserName(),
            role: user?.role || 'user',
            avatar: getAvatar(),
          }}
        />
        <section className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-auto p-8 gap-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
