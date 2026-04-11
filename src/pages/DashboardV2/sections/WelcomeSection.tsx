import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function WelcomeSection() {
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
                  Your Task Management Area
                </h2>
                <p className="text-caption-lg-regular text-muted-foreground">
                  Track all your tasks in one place
                </p>
              </div>
            </div>
            <Button asChild>
              <button className="inline-block w-fit h-fit px-4 py-3 !text-caption-lg-regular text-white">
                Learn More
              </button>
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
