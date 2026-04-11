import { useState } from 'react';
import {
  LuCamera,
  LuMail,
  LuBriefcase,
  LuGraduationCap,
  LuPen,
  LuStar,
  LuCalendar,
  LuCheck,
  LuFacebook,
  LuX,
  LuSave,
  LuUser,
} from 'react-icons/lu';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { getDisplayName } from '@/types/user';
import { userService } from '@/services/userService';
import { updateUser } from '@/store/slices/authSlice';

const recentActivities = [
  { title: 'Finish Homework', duration: '2h30m' },
  { title: 'Finish Homework', duration: '2h30m' },
  { title: 'Finish Homework', duration: '2h30m' },
  { title: 'Finish Homework', duration: '2h30m' },
];

interface EditFormData {
  firstName: string;
  lastName: string;
  work: string;
  major: string;
  bio: string;
}

export default function ProfileV2() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EditFormData>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    work: user?.work ?? '',
    major: user?.major ?? '',
    bio: user?.bio ?? '',
  });

  const handleEditClick = () => {
    setFormData({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      work: user?.work ?? '',
      major: user?.major ?? '',
      bio: user?.bio ?? '',
    });
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await userService.updateProfile({
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        work: formData.work || undefined,
        major: formData.major || undefined,
        bio: formData.bio || undefined,
      });

      if (response.error || !response.data) {
        setSaveError(response.message || 'Failed to update profile');
      } else {
        dispatch(updateUser(response.data));
        setIsEditing(false);
      }
    } catch {
      setSaveError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user ? getDisplayName(user) : 'Unknown User';

  return (
    <div className="col-span-full flex flex-col w-full font-sans">
      {/* Main Content */}
      <main className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Column: Profile Card */}
        <section className="flex flex-col w-full lg:w-[480px] bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100 flex-shrink-0 relative">
          {/* Cover & Avatar Area */}
          <div className="relative w-full h-[180px] bg-gradient-to-r from-blue-400 to-indigo-500">
            <button className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white text-gray-700 transition-all shadow-sm">
              <LuCamera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center px-8 pb-8 relative -mt-16">
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

            <div className="text-center mt-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
              {user?.bio ? (
                <p className="text-sm text-gray-500 mt-1 italic max-w-[300px]">
                  {user.bio}
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-1 italic">No bio yet</p>
              )}
            </div>

            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
              >
                <LuPen className="w-4 h-4" />
                Edit profile
              </button>
            ) : null}

            <div className="w-full h-[1px] bg-gray-200 my-6"></div>

            {/* Level & Progress */}
            <div className="w-full mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Level 56
              </h3>
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
                ></div>
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

        {/* Right Column */}
        <section className="flex flex-col flex-1 gap-6 min-w-0">
          {/* Personal Information */}
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Personal information
              </h2>
              {isEditing && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <LuX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    <LuSave className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            {saveError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {saveError}
              </div>
            )}

            <div className="flex flex-col gap-5">
              {/* Email — always read-only */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  Email address
                </span>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <LuMail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-medium truncate">
                    {user?.email ?? '—'}
                  </span>
                </div>
              </div>

              {/* Work */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  Work
                </span>
                {isEditing ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border border-blue-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                    <LuBriefcase className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={formData.work}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, work: e.target.value }))
                      }
                      placeholder="Where do you work or study?"
                      className="flex-1 text-sm font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <LuBriefcase className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-medium truncate">
                      {user?.work || (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Major */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  Major
                </span>
                {isEditing ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border border-blue-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                    <LuGraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={formData.major}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          major: e.target.value,
                        }))
                      }
                      placeholder="Your field of study or specialization"
                      className="flex-1 text-sm font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <LuGraduationCap className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-medium truncate">
                      {user?.major || (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-900">Bio</span>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Brief description about you?"
                    maxLength={500}
                    rows={3}
                    className="px-4 py-3 bg-white border border-blue-300 rounded-xl text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none placeholder:text-gray-400"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[72px]">
                    {user?.bio ? (
                      <p className="text-gray-700 text-sm font-medium italic">
                        {user.bio}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm italic">Not set</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex-1 w-full flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Recent activities
            </h2>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center px-5 py-4 bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-50 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5F33E1] to-purple-400"></div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    {activity.title}
                  </h4>
                  <span className="text-xs font-semibold text-gray-500">
                    {activity.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
