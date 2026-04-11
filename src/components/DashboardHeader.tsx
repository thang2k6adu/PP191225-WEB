import React from 'react';
import { LuSearch as Search, LuBell as Bell } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { getDisplayName, getInitials } from '@/types/user';

const DashboardHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search task..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {/* Notification */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user ? getInitials(user) : 'U'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {user ? getDisplayName(user) : 'Guest'}
              </span>
              <span className="text-xs text-gray-500">Pro Plan</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
