import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

const VAPIP_KEY = import.meta.env.VITE_VAPID_KEY;

export const requestNotificationPermission = async () => {
  console.log(VAPIP_KEY);

  try {
    // 사용자에게 알림 권한 요청
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') return;

    // 권한 승인 후 토큰 발급
    const token = await getToken(messaging, {
      vapidKey: VAPIP_KEY,
    });

    return token;
  } catch (error) {
    console.error('알림 권한 요청 오류:', error);
  }
};
