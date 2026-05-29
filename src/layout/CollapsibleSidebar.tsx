import * as React from 'react';
import {
  LuHouse as Home,
  LuFocus as Focus,
  LuList as List,
  LuMessageCircle as MessageCircle,
  LuCalendar as Calendar,
  LuSettings as Settings,
  LuUser as User,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';

export default function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const mainNavItems = [
    { icon: Home, label: 'Home', path: ROUTES.DASHBOARD },
    { icon: Focus, label: 'Focus', path: ROUTES.FOCUS },
    { icon: List, label: 'Tasks', path: ROUTES.TASKS },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
  ];

  const bottomNavItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'User', path: '/profile' },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  const baseItemClass =
    'justify-start h-12 text-gray-400 hover:text-black rounded-md hover:bg-accent hover:text-accent-foreground px-4 py-3';

  const activeItemClass =
    'bg-primary text-primary-foreground hover:bg-primary-900 hover:text-primary-foreground';

  const renderNavButton = (item: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    path: string;
  }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <Button
        key={item.label}
        variant="ghost"
        onClick={() => navigate(item.path)}
        className={cn(
          baseItemClass,
          isCollapsed ? 'gap-0 justify-center' : 'gap-3',
          active && activeItemClass
        )}
      >
        <Icon className="h-6 w-6 flex-shrink-0" />
        <span
          className={cn(
            'text-body-medium whitespace-nowrap transition-all duration-200 ease-out',
            isCollapsed
              ? 'absolute opacity-0 pointer-events-none'
              : 'relative opacity-100'
          )}
        >
          {item.label}
        </span>
      </Button>
    );
  };

  return (
    <div
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={cn(
        'relative flex h-screen flex-col bg-white shadow-md transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-end gap-1 p-6 pb-4">
          <img
            src="/logo.svg"
            className="h-8 w-8 flex-shrink-0 fill-gray-500 text-gray-500"
          />
          <span
            className={cn(
              'text-2xl text-black font-bold whitespace-nowrap overflow-hidden transition-all duration-200 ease-out',
              isCollapsed
                ? 'max-w-0 opacity-0 translate-x-[-6px]'
                : 'max-w-[200px] opacity-100 translate-x-0'
            )}
          >
            KruzeTech
          </span>
        </div>

        <nav className="flex flex-col gap-3 px-3">
          {mainNavItems.map(renderNavButton)}
        </nav>
      </div>

      <div className="flex flex-col gap-3 p-3 pb-6">
        {bottomNavItems.map(renderNavButton)}
      </div>
    </div>
  );
}
