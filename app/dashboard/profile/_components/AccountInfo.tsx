"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "@/lib/auth-client";
import { Calendar, Clock } from "lucide-react";

export default function AccountInfo({ user }: { user: Session["user"] }) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-10 space-y-6 sm:flex-row">
          <div className="flex w-full items-start gap-4">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Calendar className="text-primary h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">
                Member Since
              </p>
              <p className="text-base font-medium">
                {formatDate(user.createdAt)}
              </p>
              <p className="text-muted-foreground text-sm">
                {getRelativeTime(user.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex w-full items-start gap-4">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Clock className="text-primary h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">
                Profile Last Updated
              </p>
              <p className="text-base font-medium">
                {formatDate(user.updatedAt)}
              </p>
              <p className="text-muted-foreground text-sm">
                {getRelativeTime(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
