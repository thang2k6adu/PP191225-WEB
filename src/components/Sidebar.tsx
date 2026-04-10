import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LuLayoutDashboard as LayoutDashboard,
  LuSquareCheck as CheckSquare,
  LuCalendar as Calendar,
  LuSettings as Settings,
  LuLogOut as LogOut,
  LuSwords as Swords,
} from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/helpers';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      section: 'menu',
    },
    {
      label: 'Tasks',
      icon: CheckSquare,
      path: '/dashboard/tasks',
      badge: '12+',
      section: 'menu',
    },
    {
      label: 'Calendar',
      icon: Calendar,
      path: '/dashboard/calendar',
      section: 'menu',
    },
    {
      label: 'Matchmaking',
      icon: Swords,
      path: '/matchmaking',
      section: 'menu',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/dashboard/settings',
      section: 'general',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0',
        className
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Donezo</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Menu Section */}
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Menu
          </div>
          <div className="space-y-1">
            {menuItems
              .filter(item => item.section === 'menu')
              .map(item => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={cn(
                          'w-5 h-5',
                          active ? 'text-emerald-600' : 'text-gray-500'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-emerald-100 text-emerald-600 text-xs font-semibold px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>

        {/* General Section */}
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            General
          </div>
          <div className="space-y-1">
            {menuItems
              .filter(item => item.section === 'general')
              .map(item => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        active ? 'text-emerald-600' : 'text-gray-500'
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer - Download App */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-900 rounded-lg p-4 text-white">
          <p className="text-sm font-medium mb-2">Download our Mobile App</p>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
            Download
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
