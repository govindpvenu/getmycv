"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, UserPen } from "lucide-react";
import ChangeAvatar from "./ChangeAvatar";
import { Session } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";

export default function ProfileHeader({ user }: { user: Session["user"] }) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <ChangeAvatar image={user?.image ?? null} />

          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              {user?.emailVerified ? (
                <Badge variant="secondary">Verified</Badge>
              ) : (
                <Badge variant="destructive">Unverified</Badge>
              )}
            </div>
            {user?.username ? (
              <p className="text-muted-foreground">@{user?.username}</p>
            ) : (
              <p className="text-destructive">
                Set a username before adding containers.
              </p>
            )}
            <div className="text-muted-foreground flex flex-wrap justify-between gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user?.email}
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Joined on{" "}
                {user?.createdAt?.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </div>
              <div className="flex items-center gap-1">
                <UserPen className="size-4" />
                Last updated {getRelativeTime(user.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const getRelativeTime = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    }
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
};
