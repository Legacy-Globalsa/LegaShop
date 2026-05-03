import { useEffect, useRef } from "react";
import { requestNotificationPermission, onForegroundMessage } from "@/lib/firebase";
import { registerDeviceToken } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook that handles FCM push notification setup:
 * 1. Requests browser notification permission
 * 2. Gets FCM token
 * 3. Registers token with backend
 * 4. Listens for foreground messages and shows toast
 *
 * Call this once in your app layout when user is logged in.
 */
export function useNotifications(isLoggedIn: boolean) {
  const { toast } = useToast();
  const registered = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || registered.current) return;

    async function setup() {
      try {
        const token = await requestNotificationPermission();
        if (!token) {
          console.log("No FCM token — notifications not enabled");
          return;
        }

        // Register token with backend
        const result = await registerDeviceToken(token);
        console.log("Device token registered:", result);
        registered.current = true;

        // Listen for foreground messages (app is open)
        onForegroundMessage((payload) => {
          console.log("Foreground message:", payload);
          toast({
            title: payload.notification?.title || "LegaShop",
            description: payload.notification?.body || "",
          });
        });
      } catch (error) {
        console.error("Notification setup failed:", error);
      }
    }

    setup();
  }, [isLoggedIn, toast]);
}
