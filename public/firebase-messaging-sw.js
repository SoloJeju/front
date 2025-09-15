importScripts(
  'https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyCcIy1ms2kOBtquJRCCq2PSxXRi4AJ9ewE',
  authDomain: 'soloj-58a0b.firebaseapp.com',
  projectId: 'soloj-58a0b',
  storageBucket: 'soloj-58a0b.firebasestorage.app',
  messagingSenderId: '308173231910',
  appId: '1:308173231910:web:c70c3539cf8d10afa853e7',
  measurementId: 'G-N3C84CM81C',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 백그라운드 메시지 처리
messaging.onBackgroundMessage(function (payload) {
  console.log('백그라운드 메시지 수신:', payload);

  const title = payload.notification?.title || payload.data?.title || '알림';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: '/assets/favicon.svg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
