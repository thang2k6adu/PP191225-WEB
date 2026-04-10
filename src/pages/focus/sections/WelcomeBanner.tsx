import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { UserState } from '@/types/matchmaking';
import { LuLoaderCircle as Loader2 } from 'react-icons/lu';
import toast from 'react-hot-toast';

export function WelcomeBanner() {
  const { joinMatchmaking, state, isConnected, isJoining, connect } =
    useMatchmaking();

  const handleMatchNow = async () => {
    // If not connected, connect first
    if (!isConnected) {
      toast.loading('Connecting to server...', { id: 'connecting' });
      try {
        await connect();
        toast.success('Connected!', { id: 'connecting' });
      } catch {
        toast.error('Failed to connect. Please try again.', {
          id: 'connecting',
        });
        return;
      }
    }

    joinMatchmaking();
  };

  const isMatching = state === UserState.WAITING || isJoining;

  return (
    <Card className="w-full rounded-md shadow-md bg-card">
      <CardContent className="p-6">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col justify-between w-full">
            <div className="flex flex-col gap-3 w-full">
              <p className="text-h6-regular text-muted-foreground">
                Welcome To
              </p>

              <div className="flex flex-col gap-0 w-fit">
                <h2 className="text-h5-bold text-gray-black">
                  Room Matching Area{' '}
                </h2>
                <p className="text-caption-lg-regular text-muted-foreground">
                  You can match with other partner to finish your task or join
                  public room to focus with others{' '}
                </p>
              </div>
            </div>
            <Button
              type="button"
              className="inline-block w-fit h-fit px-4 py-3 !text-caption-lg-regular text-white disabled:opacity-50"
              onClick={handleMatchNow}
              disabled={isMatching}
            >
              {isMatching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block" />
                  Matching...
                </>
              ) : (
                'Match Now!'
              )}
            </Button>
          </div>

          <img
            width={314}
            height={190}
            src="/icons/welcome-image.png"
            alt="Welcome"
          />
        </div>
      </CardContent>
    </Card>
  );
}
