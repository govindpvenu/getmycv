"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  containerId: string;
  hasViewed: boolean;
}

export default function ViewTracker({
  containerId,
  hasViewed,
}: ViewTrackerProps) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasViewed || hasTriggered.current) return;
    hasTriggered.current = true;

    async function trackView() {
      try {
        await fetch(`/api/containers/${containerId}/view`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Failed to track resume view", error);
      }
    }

    void trackView();
  }, [containerId, hasViewed]);

  return null;
}
