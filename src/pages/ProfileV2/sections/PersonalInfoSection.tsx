import { useEffect, useState } from 'react';
import {
  LuUser,
  LuMail,
  LuBriefcase,
  LuGraduationCap,
  LuX,
  LuSave,
} from 'react-icons/lu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userService } from '@/services/userService';
import { updateUser } from '@/store/slices/authSlice';
import { EditFormData, RECENT_ACTIVITIES } from '../constants';

interface PersonalInfoSectionProps {
  isEditing: boolean;
  onCancel: () => void;
  onSaveSuccess: () => void;
}

export function PersonalInfoSection({
  isEditing,
  onCancel,
  onSaveSuccess,
}: PersonalInfoSectionProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditFormData>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    contactEmail: user?.contactEmail ?? '',
    work: user?.work ?? '',
    major: user?.major ?? '',
    bio: user?.bio ?? '',
  });

  useEffect(() => {
    setFormData({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      contactEmail: user?.contactEmail ?? '',
      work: user?.work ?? '',
      major: user?.major ?? '',
      bio: user?.bio ?? '',
    });
  }, [user]);

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      contactEmail: user?.contactEmail ?? '',
      work: user?.work ?? '',
      major: user?.major ?? '',
      bio: user?.bio ?? '',
    });
    setSaveError(null);
    onCancel();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await userService.updateProfile({
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        contactEmail: formData.contactEmail || undefined,
        work: formData.work || undefined,
        major: formData.major || undefined,
        bio: formData.bio || undefined,
      });

      if (response.error || !response.data) {
        setSaveError(response.message || 'Failed to update profile');
      } else {
        dispatch(updateUser(response.data));
        onSaveSuccess();
      }
    } catch {
      setSaveError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="flex flex-col flex-1 gap-6 min-w-0">
      <div className="bg-white rounded-md p-8 shadow-md border border-gray-100 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h6-medium text-gray-900">Personal information</h2>

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
          {/* Name */}
          {isEditing && (
            <div className="flex flex-col gap-2">
              <span className="text-base-medium text-gray-900">Name</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-blue-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <LuUser className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="First name"
                    className="flex-1 text-sm font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-blue-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <LuUser className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Last name"
                    className="flex-1 text-sm font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Email */}
          <div className="flex flex-col gap-2">
            <span className="text-base-medium text-gray-900">
              Contact email
            </span>
            {isEditing ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-white border border-blue-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <LuMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      contactEmail: e.target.value,
                    }))
                  }
                  placeholder="contact@example.com"
                  className="flex-1 text-sm font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                <LuMail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm font-medium truncate">
                  {user?.contactEmail || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Work */}
          <div className="flex flex-col gap-2">
            <span className="text-base-medium text-gray-900">Work</span>
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
            <span className="text-base-medium text-gray-900">Major</span>
            {isEditing ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-white border border-blue-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <LuGraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={formData.major}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, major: e.target.value }))
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
            <span className="text-base-medium text-gray-900">Bio</span>
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
                  <p className="text-gray-700 text-sm font-medium">
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

      <div className="bg-white rounded-[24px] p-8 shadow-md border border-gray-100 flex-1 w-full flex flex-col">
        <h2 className="text-h6-medium text-gray-900 mb-6">Recent activities</h2>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0">
          {RECENT_ACTIVITIES.map((activity, index) => (
            <div
              key={index}
              className="flex flex-col justify-center px-5 py-4 bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-50 relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5F33E1] to-purple-400" />
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
  );
}
