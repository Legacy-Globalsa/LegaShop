import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only initialize Firebase if the required config values are present
const isConfigured = !!(firebaseConfig.projectId && firebaseConfig.apiKey && firebaseConfig.appId);

const app = isConfigured ? initializeApp(firebaseConfig) : null;

// Initialize Cloud Messaging (only in browser with valid config)
const messaging = isConfigured && typeof window !== "undefined" && app
  ? getMessaging(app)
  : null;

/**
 * Request notification permission and get the FCM token.
 * This token is sent to the backend so it can push notifications to this browser.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Explicitly register the service worker first
    const swRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("Service worker registered:", swRegistration);

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swRegistration,
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Failed to get FCM token:", error);
    return null;
  }
}

/**
 * Listen for foreground messages (when app is open in browser).
 * Background messages are handled by the service worker.
 */
export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return;
  onMessage(messaging, callback);
}

export { app, messaging };
