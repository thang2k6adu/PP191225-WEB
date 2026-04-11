import {
  LuCamera,
  LuStar,
  LuCheck,
  LuCalendar,
  LuFacebook,
  LuUser,
  LuPen,
} from 'react-icons/lu';
import { useAppSelector } from '@/store/hooks';
import { getDisplayName } from '@/types/user';

interface ProfileCardSectionProps {
  onEditClick: () => void;
  isEditing: boolean;
}

export function ProfileCardSection({
  onEditClick,
  isEditing,
}: ProfileCardSectionProps) {
  const user = useAppSelector(state => state.auth.user);
  const displayName = user ? getDisplayName(user) : 'Unknown User';

  return (
    <section className="flex flex-col w-full lg:w-[480px] bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100 flex-shrink-0 relative">
      {/* Cover & Avatar Area */}
      <div className="relative w-full h-[180px] bg-gradient-to-r from-blue-400 to-indigo-500">
        <button className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white text-gray-700 transition-all shadow-sm">
          <LuCamera className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center px-8 pb-8 relative -mt-16">
        {/* Avatar */}
        <div className="relative group">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile avatar"
              className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white shadow-sm"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-indigo-200 shadow-sm flex items-center justify-center">
              <LuUser className="w-14 h-14 text-indigo-400" />
            </div>
          )}
          <button className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow border border-gray-100 text-gray-600 hover:text-gray-900 transition-all">
            <LuCamera className="w-4 h-4" />
          </button>
        </div>

        {/* Name & Bio */}
        <div className="text-center mt-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
          {user?.bio?.trim() && (
            <p className="text-sm text-gray-500 mt-1 italic max-w-[300px]">
              {user.bio}
            </p>
          )}
        </div>

        {!isEditing && (
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
          >
            <LuPen className="w-4 h-4" />
            Edit profile
          </button>
        )}

        <div className="w-full h-[1px] bg-gray-200 my-6" />

        {/* Level & Progress */}
        <div className="w-full mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-3">Level 56</h3>
          <div className="flex items-center gap-2 mb-2 text-blue-600 text-sm font-semibold">
            <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
              <LuStar className="w-3.5 h-3.5" />
            </div>
            2,000,000
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: '85%' }}
            />
          </div>
        </div>

        {/* Achievements */}
        <div className="w-full">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                <LuCheck className="w-4 h-4" />
                Total spent hours
              </div>
              <span className="text-gray-900 font-bold text-base">100</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                <LuCalendar className="w-4 h-4" />
                Member since
              </div>
              <span className="text-gray-900 font-bold text-base">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'April 12, 2006'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                <LuCheck className="w-4 h-4" />
                Total finished tasks
              </div>
              <span className="text-gray-900 font-bold text-base">50</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                <LuFacebook className="w-4 h-4" />
                Facebook
              </div>
              <a
                href="#"
                className="text-blue-600 hover:underline font-bold text-sm"
              >
                Go to page &gt;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
