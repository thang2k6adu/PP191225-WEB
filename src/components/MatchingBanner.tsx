import { useMatchmaking } from '@/hooks/useMatchmaking';
import { UserState } from '@/types/matchmaking';
import { LuX as X } from 'react-icons/lu';

export default function MatchingBanner() {
  const { state, cancelMatchmaking, error, clearError } = useMatchmaking();

  // Don't show banner if IDLE or IN_ROOM
  if (state === UserState.IDLE || state === UserState.IN_ROOM) {
    return null;
  }

  const handleCancel = () => {
    cancelMatchmaking();
  };

  const handleDismissError = () => {
    clearError();
  };

  // Error state
  if (error) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top duration-300">
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="font-medium">Error: {error}</span>
          </div>
          <button
            onClick={handleDismissError}
            className="p-1 hover:bg-red-600 rounded transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Matching state
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top duration-300">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
            <div className="relative w-5 h-5 bg-white rounded-full" />
          </div>
          <div>
            <span className="font-semibold text-lg">Matching...</span>
            <p className="text-xs text-purple-100 mt-0.5">
              Finding the perfect study partner for you
            </p>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors font-medium text-sm backdrop-blur-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
