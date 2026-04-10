import { LuBell as Bell, LuChevronDown as ChevronDown } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type HeaderProps = {
  user?: {
    name: string;
    role?: string;
    avatar?: string;
  };
};

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 shadow-[0_1px_8px_-2px_rgba(0,0,0,0.15)] bg-white">
      <div className="px-8 md:px-6">
        <div className="flex items-center justify-between gap-3 py-4">
          <Input
            placeholder="Search tasks..."
            className="px-10 py-3 bg-white w-[320px] h-12 rounded-md shadow-md !text-caption-lg-regular text-black"
            aria-label="Search tasks"
          />

          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="w-fit h-fit rounded-full shadow-md p-2"
            >
              <Bell className="!size-6" fill="currentColor" />
              <span className="sr-only">Notifications</span>
            </Button>

            <Button
              variant="ghost"
              className="h-auto p-2 rounded-full shadow-md"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-caption-lg-semibold">
                    {user?.name ?? 'Guest'}
                  </span>
                  {user?.role && (
                    <span className="text-caption-sm-regular text-muted-foreground">
                      {user.role}
                    </span>
                  )}
                </div>

                <ChevronDown className="size-4 text-slate-500" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
