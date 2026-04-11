import { RoomCard } from '../components/RoomCard';
import { Room } from '../types';

type RoomsGridProps = {
  rooms: Room[];
  onJoinRoom?: (roomId: string) => void;
};

export function RoomsGrid({ rooms, onJoinRoom }: RoomsGridProps) {
  return (
    <div>
      <h6 className="text-h6-medium text-black mb-4">All Rooms</h6>

      {rooms.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No rooms available at the moment.</p>
          <p className="text-sm mt-2">Check back later!</p>
        </div>
      ) : (
        <div
          className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
        >
          {rooms.map(room => (
            <RoomCard
              key={room.id}
              {...room}
              onJoin={() => onJoinRoom?.(room.roomId || room.id.toString())}
            />
          ))}
        </div>
      )}
    </div>
  );
}
