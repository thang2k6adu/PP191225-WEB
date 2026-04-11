export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  work: string | null;
  major: string | null;
  bio: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getDisplayName = (profile: UserProfile): string => {
  const parts = [profile.firstName, profile.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : profile.email;
};

export const getInitials = (profile: UserProfile): string => {
  if (profile.firstName && profile.lastName) {
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  }
  if (profile.firstName) return profile.firstName[0].toUpperCase();
  return profile.email[0].toUpperCase();
};
