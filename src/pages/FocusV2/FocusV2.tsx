import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterSidebar } from './sections/FilterSidebar';
import { WelcomeBanner } from './sections/WelcomeBanner';
import { RoomsGrid } from './sections/RoomsGrid';
import { useRooms } from '@/hooks/useRooms';
import { useActiveRoomGuard } from '@/hooks/useActiveRoomGuard';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import LoadingSpinner from '@/components/LoadingSpinner';
import MatchingBanner from '@/components/MatchingBanner';
import { Room } from './types';
import { Helmet } from 'react-helmet-async';
import { getNatureImage } from '@/utils/images';
import { UserState } from '@/types/matchmaking';
import { ROUTES } from '@/constants';

export default function FocusV2() {
  const navigate = useNavigate();
  const { publicRooms, isLoading, fetchPublicRooms } = useRooms();
  const { matchData, state, clearError } = useMatchmaking();
  const { requestJoinRoom, requestMatchmaking, conflictDialog } =
    useActiveRoomGuard();

  useEffect(() => {
    fetchPublicRooms();
  }, [fetchPublicRooms]);

  // Redirect to room when matched
  useEffect(() => {
    if (matchData && state === UserState.IN_ROOM) {
      const roomId = matchData.roomId;

      if (roomId) {
        clearError();
        navigate(`${ROUTES.FOCUS_ROOM}/${roomId}`);
      }
    }
  }, [matchData, state, navigate, clearError]);

  // Transform API data to UI format
  const rooms: Room[] = useMemo(() => {
    return publicRooms.map((room, index) => ({
      id: parseInt(room.id.substring(0, 8), 16), // Convert UUID to number for UI
      roomId: room.id, // Keep original UUID for API calls
      title: room.topic || 'Study Room',
      subtitle: "Let's study and be productive",
      image: getNatureImage(index),
      members: Array.from(
        { length: room.currentMembers },
        (_, i) => `https://i.pravatar.cc/150?img=${index * 10 + i + 1}`
      ),
      isFavorite: false,
      currentMembers: room.currentMembers,
      maxMembers: room.maxMembers,
    }));
  }, [publicRooms]);

  if (isLoading && publicRooms.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {conflictDialog}

      <Helmet>
        <title>Focus Rooms - Focus Hub</title>
        <meta
          name="description"
          content="Join study rooms and focus together"
        />
      </Helmet>

      <MatchingBanner />

      <div className="col-span-3 bg-white rounded-lg border p-4 mb-6 shadow-md">
        <FilterSidebar />
      </div>

      <div className="col-span-9 space-y-8">
        <WelcomeBanner onMatchRequest={requestMatchmaking} />

        <RoomsGrid rooms={rooms} onJoinRoom={requestJoinRoom} />
      </div>
    </>
  );
}
