"use client";
import { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarLink,
} from "@/components/ui/sidebar";

import { motion } from "motion/react";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ConfirmLogOut } from "./ConfirmLogOut";
import {
  Boxes,
  CircleUser,
  Cog,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <LayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: (
      <CircleUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <Cog className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
];

export function SidebarMain({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen} animate={true}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <>{open ? <Logo /> : <LogoIcon />} </>
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
            <LogOut />
          </div>
        </div>
        <div>
          <SidebarItem item={<ThemeToggle />} label="Toggle Theme" />

          <SidebarItem
            item={
              <Avatar>
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="uppercase">
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            }
            label={user?.name}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

function LogOut() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <SidebarItem
          item={
            <LogOutIcon className="h-5 w-5 rotate-180 shrink-0 text-neutral-700 dark:text-neutral-200" />
          }
          label="Logout"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Log out </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ConfirmLogOut />
          <AlertDialogCancel>Nope</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="relative  z-20 flex items-center space-x-2 py-1 text-xl font-normal text-primary"
    >
      <Boxes className="size-7 shrink-0 hover:rotate-180 transition-transform duration-300 " />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-xl font-sans whitespace-pre text-primary"
      >
        GetMyCV
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-xl font-normal text-primary"
    >
      <Boxes className="size-7 shrink-0  " />
    </Link>
  );
};
