import { useState } from 'react';
import { ProfileCardSection } from './sections/ProfileCardSection';
import { PersonalInfoSection } from './sections/PersonalInfoSection';

export default function ProfileV2() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleSaveSuccess = () => setIsEditing(false);

  return (
    <div className="col-span-full flex flex-col w-full font-sans">
      <main className="flex flex-col lg:flex-row gap-6 w-full">
        <ProfileCardSection
          isEditing={isEditing}
          onEditClick={handleEditClick}
        />
        <PersonalInfoSection
          isEditing={isEditing}
          onCancel={handleCancel}
          onSaveSuccess={handleSaveSuccess}
        />
      </main>
    </div>
  );
}
