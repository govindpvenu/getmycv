"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, UserPen } from "lucide-react";
import ChangeAvatar from "./ChangeAvatar";
import { Session } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";
import { getRelativeTime } from "@/lib/utils";

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
                Last updated {getRelativeTime(user.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
