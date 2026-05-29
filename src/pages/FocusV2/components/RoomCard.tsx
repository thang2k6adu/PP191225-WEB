import { Room } from '../types';
import { LuUsers as Users } from 'react-icons/lu';

type RoomCardProps = Room & {
  onJoin?: (id: string) => void;
};

export function RoomCard({
  id,
  title,
  subtitle,
  image,
  members,
  onJoin,
}: RoomCardProps) {
  return (
    <div className="rounded-md overflow-hidden hover:shadow-lg transition group bg-white shadow-md">
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex-1">
            <h4 className="text-body-medium text-primary">{title}</h4>
            <p className="text-caption-lg-regular text-gray-500">{subtitle}</p>
          </div>

          <div className="flex items-center gap-1 text-primary text-caption-lg-regular shrink-0">
            <Users className="w-4 h-4" />
            <span className="">{members.length}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt="Member"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}

            {members.length > 3 && (
              <div
                className="
          w-8 h-8 rounded-full border-2 border-white
          bg-gray-300 text-white
          flex items-center justify-center
          text-caption-sm-regular
        "
              >
                +{members.length - 3}
              </div>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-green-600 text-caption-sm-regular">
            <span className="w-2 h-2 rounded-full bg-green-600" />
            Active
          </span>
        </div>

        <div className="flex items-center justify-end mt-3">
          <button
            className={`inline-block px-4 py-2.5 bg-primary text-caption-lg-regular text-white rounded-full transition`}
            onClick={() => onJoin?.(id)}
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}
