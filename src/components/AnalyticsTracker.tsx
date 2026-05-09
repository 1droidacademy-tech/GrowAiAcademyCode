"use client";

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return;

    const trackVisitor = async () => {
      let visitorId = localStorage.getItem("growaiedu_visitor_id");

      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("growaiedu_visitor_id", visitorId);
      }

      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visitor_id: visitorId }),
        });
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    trackVisitor();
  }, []);

  return null; // This component doesn't render anything
}
