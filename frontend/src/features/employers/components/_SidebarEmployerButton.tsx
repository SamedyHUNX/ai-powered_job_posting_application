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

export function SidebarEmployerButtonClient({ user }: { user: User }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const openOrganizationProfile = () => {
    setOpenMobile(false);
    router.push("/organizations/profile");
  };

  return (
    <SidebarMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size={"lg"}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <EmployerInfo user={user}/>
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
            <EmployerInfo user={user}  />
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
            <Link href={"/organizations/select"}>
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

function EmployerInfo({
  user,
}: {
  user: User;
}) {
  const nameInitial =     .split(" ")
    .slice(0, 2)
    .map((str) => str[0])
    .join("");

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <Avatar className="rounded-lg size-8">
        <AvatarImage src={imageUrl} alt={orgName} />
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameInitial}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">{orgName}</span>
        <span className="truncate text-sm font-medium">{user.email}</span>
      </div>
    </div>
  );
}
