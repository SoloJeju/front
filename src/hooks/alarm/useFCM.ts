import { useEffect, useRef, useCallback } from 'react';
import { requestNotificationPermission } from '../../firebase/requestNotificationPermission ';
import { registerFcmToken } from '../../apis/alarm';

const useFCM = () => {
  const initialized = useRef(false);
  const previousToken = useRef<string | null>(null);

  const updateToken = useCallback(() => {
    // accessToken이 없으면 리턴
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    // 알림 권한 요청 및 토큰 업데이트
    requestNotificationPermission()
      .then((token) => {
        if (!token) return;

        if (token !== previousToken.current) {
          registerFcmToken(token);
          previousToken.current = token;
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  useEffect(() => {
    // 중복 호출 방지
    if (initialized.current) return;
    initialized.current = true;

    updateToken();

    // 일정 시간 간격으로 이전 토큰 값과 비교
    const interval = setInterval(
      () => {
        updateToken();
      },
      1000 * 60 * 60
    ); // 1시간 간격

    return () => clearInterval(interval);
  }, [updateToken]);

  return { updateToken }; // 외부에서 실행 가능
};

export default useFCM;
