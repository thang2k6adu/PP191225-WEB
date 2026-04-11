import {
  LuBell as Bell,
  LuChevronDown as ChevronDown,
  LuLogOut as LogOut,
  LuUser as UserIcon,
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { logoutThunk } from '@/store/thunks/authThunks';
import { ROUTES } from '@/constants';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type HeaderProps = {
  user?: {
    name: string;
    initials?: string;
    role?: string;
    avatar?: string;
  };
};

export function Header({ user }: HeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-2 rounded-full shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.initials ??
                          user?.name?.[0]?.toUpperCase() ??
                          'U'}
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
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 mr-6" align="start">
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1.5 text-sm font-medium text-slate-500">
                    My Account
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm font-normal"
                    onClick={() => {}}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={async () => {
                      await dispatch(logoutThunk());
                      navigate(ROUTES.LOGIN);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
