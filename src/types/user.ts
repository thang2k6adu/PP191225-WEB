export interface UserProfile {
  id: string;
  email: string;
  contactEmail: string | null;
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
  return parts.length > 0 ? parts.join(' ') : profile.contactEmail || 'User';
};

export const getInitials = (profile: UserProfile): string => {
  if (profile.firstName && profile.lastName) {
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  }
  if (profile.firstName) return profile.firstName[0].toUpperCase();
  if (profile.contactEmail) return profile.contactEmail[0].toUpperCase();
  return 'U';
};
