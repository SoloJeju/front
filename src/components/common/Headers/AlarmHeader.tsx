import { useNavigate } from 'react-router-dom';
import Alarm from '../../../assets/alarmIcon.svg';
import Logo from '../../../assets/logo-home.svg';
import { useEffect, useRef, useState } from 'react';
import { getUnreadNoti } from '../../../apis/alarm';

interface AlarmHeaderProps {
  title?: string;
  showLogo?: boolean;
  showTitle?: boolean;
}

const AlarmHeader = ({
  title,
  showLogo = false,
  showTitle = true,
}: AlarmHeaderProps) => {
  const navigate = useNavigate();
  const initialized = useRef(false);
  const [hasUnreadNoti, setHasUnreadNoti] = useState(false);

  useEffect(() => {
    const fetchUnreadNoti = async () => {
      // 중복 방지
      if (initialized.current) return;
      initialized.current = true;

      try {
        const data = await getUnreadNoti();
        console.log(data.result);
        setHasUnreadNoti(data.result);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUnreadNoti();
  }, []);

  const handleClickAlarm = () => {
    navigate('/alarm');
  };

  return (
    <header className="fixed top-0 max-w-[480px] w-full p-3 flex items-center justify-between bg-white z-50">
      <div className="flex justify-start">
        {showLogo && <img src={Logo} alt="로고" />}
      </div>
      <div className="flex justify-center">
        {showTitle && (
          <span className="text-black-2 text-lg font-semibold font-['Pretendard'] leading-relaxed">
            {title}
          </span>
        )}
      </div>
      <div className="w-6 h-6 flex justify-end relative">
        <button
          type="button"
          className="cursor-pointer w-6 h-6"
          onClick={handleClickAlarm}
        >
          {hasUnreadNoti && (
            <div className="absolute right-0 w-2 h-2 rounded-full bg-red-500"></div>
          )}
          <img src={Alarm} alt="알람" />
        </button>
      </div>
    </header>
  );
};

export default AlarmHeader;
