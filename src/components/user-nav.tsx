
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useWallet } from "@/hooks/use-wallet";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserNav() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
  const { address, disconnectWallet } = useWallet();
  const router = useRouter();

  const formatAddress = (addr: string | null) => {
    if (!addr) return "Not Connected";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            {userAvatar && (
              <AvatarImage
                src={userAvatar.imageUrl}
                alt="User Avatar"
                data-ai-hint={userAvatar.imageHint}
              />
            )}
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Wallet</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {address ? formatAddress(address) : "Not Connected"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            Profile
            <DropdownMenuShortcut>⌥A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
          <DropdownMenuShortcut>⌥L</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
