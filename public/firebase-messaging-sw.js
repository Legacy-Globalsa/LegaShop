// Firebase Cloud Messaging Service Worker
// This runs in the background even when the app is closed
// Using v9 compat which is stable and available on the CDN

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCieGYCmsO9doKDu972rmM7imIJjjKxQso",
  authDomain: "legashop-sms.firebaseapp.com",
  projectId: "legashop-sms",
  storageBucket: "legashop-sms.firebasestorage.app",
  messagingSenderId: "557152661181",
  appId: "1:557152661181:web:51c3e0914b5d1f46bbd1d4",
});

const messaging = firebase.messaging();

// Handle background messages (when app is not in focus)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message:', payload);

  const title = payload.notification?.title || 'LegaShop';
  const options = {
    body: payload.notification?.body || '',
    icon: '/legashop-icon.png',
    badge: '/legashop-icon.png',
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
