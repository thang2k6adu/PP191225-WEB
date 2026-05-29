import { ChangeEvent, useRef, useState } from 'react';
import {
  LuCamera,
  LuCheck,
  LuCalendar,
  LuFacebook,
  LuUser,
  LuPen,
} from 'react-icons/lu';
import { GiAchievement } from 'react-icons/gi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getDisplayName } from '@/types/user';
import {
  formatExp,
  getLevelFromExp,
  getLevelProgress,
} from '@/utils/profile-exp';
import { storageService } from '@/services/storageService';
import { userService } from '@/services/userService';
import { updateUser } from '@/store/slices/authSlice';

interface ProfileCardSectionProps {
  onEditClick: () => void;
  isEditing: boolean;
}

export function ProfileCardSection({
  onEditClick,
  isEditing,
}: ProfileCardSectionProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const displayName = user ? getDisplayName(user) : 'Unknown User';
  const exp = user?.exp ?? 0;
  const level = getLevelFromExp(exp);
  const levelProgress = getLevelProgress(exp);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const normalizeAvatarUrl = (url: string): string => {
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    const assetBaseUrl = import.meta.env.VITE_ASSET_BASE_URL;
    if (assetBaseUrl) {
      const normalizedAssetBase = assetBaseUrl.replace(/\/$/, '');
      const normalizedPath = url.startsWith('/') ? url : `/${url}`;
      return `${normalizedAssetBase}${normalizedPath}`;
    }

    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, '');
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;

    return `${backendOrigin}${normalizedPath}`;
  };

  const triggerAvatarPicker = () => {
    if (isUploadingAvatar) return;
    fileInputRef.current?.click();
  };

  const handleAvatarSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file.');
      event.target.value = '';
      return;
    }

    setAvatarError(null);
    setIsUploadingAvatar(true);

    try {
      const uploadResponse = await storageService.uploadAvatar(selectedFile);

      if (uploadResponse.error || !uploadResponse.data?.url) {
        setAvatarError(uploadResponse.message || 'Failed to upload avatar.');
        return;
      }

      const normalizedAvatarUrl = normalizeAvatarUrl(uploadResponse.data.url);
      const updateResponse = await userService.updateProfile({
        avatar: normalizedAvatarUrl,
      });

      if (updateResponse.error) {
        setAvatarError(updateResponse.message || 'Failed to update avatar.');
        return;
      }

      dispatch(
        updateUser({
          avatar: updateResponse.data?.avatar || normalizedAvatarUrl,
        })
      );
    } catch {
      setAvatarError('An unexpected error occurred while uploading avatar.');
    } finally {
      event.target.value = '';
      setIsUploadingAvatar(false);
    }
  };

  return (
    <section className="flex flex-col w-full lg:w-[480px] bg-white rounded-[24px] shadow-md overflow-hidden border border-gray-100 flex-shrink-0 relative">
      {/* Cover & Avatar Area */}
      <div className="relative w-full h-[180px] bg-gradient-to-r from-blue-400 to-indigo-500">
        <button
          onClick={triggerAvatarPicker}
          disabled={isUploadingAvatar}
          className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white text-gray-700 transition-all shadow-sm disabled:opacity-60"
        >
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
          <button
            onClick={triggerAvatarPicker}
            disabled={isUploadingAvatar}
            className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow border border-gray-100 text-gray-600 hover:text-gray-900 transition-all disabled:opacity-60"
          >
            <LuCamera className="w-4 h-4" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarSelected}
          disabled={isUploadingAvatar}
        />

        {avatarError && (
          <p className="mt-3 text-sm text-red-500 text-center">{avatarError}</p>
        )}

        {isUploadingAvatar && (
          <p className="mt-3 text-sm text-blue-600 text-center">
            Uploading avatar...
          </p>
        )}

        {/* Name & Bio */}
        <div className="text-center mt-4 mb-4">
          <h2 className="text-h5-medium text-gray-900">{displayName}</h2>
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
        <div className="w-full">
          <h3 className="text-h6-medium text-gray-900 mb-3">Level {level}</h3>
          <div className="flex items-center gap-2 mb-2 text-blue-600 text-base-medium">
            <img
              src="/icons/project-experience.svg"
              alt="EXP"
              className="w-7 h-7"
            />
            {formatExp(exp)}
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-200 my-6" />

        {/* Achievements */}
        <div className="w-full">
          <h3 className="text-h6-medium text-gray-900 mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-gray-500 text-caption-lg-regular">
                <GiAchievement className="w-5 h-5" />
                Total spent hours
              </div>
              <span className="text-gray-900 text-base-regular">100</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500 text-caption-lg-regular">
                <LuCalendar className="w-5 h-5" />
                Member since
              </div>
              <span className="text-gray-900 text-base-regular">
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
              <div className="flex items-center gap-1 text-gray-500 text-caption-lg-regular">
                <LuCheck className="w-5 h-5" />
                Total finished tasks
              </div>
              <span className="text-gray-900 text-base-regular">50</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-gray-500 text-caption-lg-regular">
                <LuFacebook className="w-5 h-5" />
                Facebook
              </div>
              <a
                href="#"
                className="text-blue-600 hover:underline text-base-regular"
              >
                Go to page &gt;
              </a>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 my-6" />
        </div>
      </div>
    </section>
  );
}
