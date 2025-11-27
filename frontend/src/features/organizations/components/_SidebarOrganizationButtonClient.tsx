"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ArrowLeftRightIcon,
  Building2,
  ChevronsUpDown,
  CreditCard,
  UserRoundCogIcon,
} from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/services/auth/components/AuthButtons";
import { useRouter } from "next/navigation";
import { User } from "@/store/slices/auth-slice";

export function SidebarOrganizationButtonClient({
  user,
  orgName,
  imageUrl,
}: {
  user: User;
  orgName: string | null;
  imageUrl: string | null;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const openOrganizationProfile = () => {
    setOpenMobile(false);
    router.push("/employer/organizations/select");
  };

  return (
    <SidebarMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size={"lg"}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <OrganizationInfo
              user={user}
              orgName={orgName}
              imageUrl={imageUrl}
            />
            <ChevronsUpDown className="ml-auto group-data-[state=collapsed]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={4}
          align="end"
          side={isMobile ? "bottom" : "right"}
          className="min-w-64 max-w-80"
        >
          <DropdownMenuLabel>
            <OrganizationInfo
              user={user}
              orgName={orgName}
              imageUrl={imageUrl}
            />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openOrganizationProfile}>
            <Building2 className="mr-1" /> Manage Organization
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/employer/user-settings"}>
              <UserRoundCogIcon className="mr-1" />
              User Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/employer/pricing"}>
              <CreditCard className="mr-1" />
              Change Plan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/employer/organizations/select"}>
              <ArrowLeftRightIcon className="mr-1" />
              Switch Organizations
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenu>
  );
}

function OrganizationInfo({
  user,
  orgName,
  imageUrl,
}: {
  user: User;
  orgName: string | null;
  imageUrl: string | null;
}) {
  const displayName = orgName || user.username;

  const nameInitial = displayName
    .split(" ")
    .slice(0, 2)
    .map((str) => str[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <Avatar className="rounded-lg size-8">
        <AvatarImage src={imageUrl || undefined} alt={displayName} />
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameInitial}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">{`${displayName}'s org`}</span>
        <span className="truncate text-sm font-medium">{user.email}</span>
      </div>
    </div>
  );
}
