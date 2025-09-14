import { useNavigate } from 'react-router-dom';
import Alarm from '../../../assets/alarmIcon.svg';
import Logo from '../../../assets/logo-home.svg';
import ShieldCheck from '../../../assets/shieldCheck.svg';
import useGetUnreadNoti from '../../../hooks/alarm/useGetUnreadNoti';

interface AlarmHeaderProps {
  title?: string;
  showLogo?: boolean;
  showTitle?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const AlarmHeader = ({
  title,
  showLogo = false,
  showTitle = true,
  showBackButton = false,
  onBackClick,
}: AlarmHeaderProps) => {
  const navigate = useNavigate();
  // const [hasUnreadNoti, setHasUnreadNoti] = useState(false);

  const {
    data: hasUnreadNoti,
    isLoading: isLoadingUnreadNoti,
    isError: isErrorUnreadNoti,
  } = useGetUnreadNoti();

  const handleClickAlarm = () => {
    navigate('/alarm');
  };

  const handleClickShieldCheck = () => {
    navigate('/safety-check');
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  if (isLoadingUnreadNoti) {
    // loading ui
    return <div>Loading...</div>;
  }

  if (isErrorUnreadNoti) {
    return <div>Error!</div>;
  }

  return (
    <header className="fixed top-0 max-w-[480px] w-full p-4 flex items-center justify-between bg-white z-50">
      <div className="flex justify-start items-center">
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        {showLogo && <img src={Logo} alt="로고" />}
      </div>
      <div className="flex justify-center flex-1">
        {showTitle && (
          <span className="text-black-2 text-lg font-semibold font-['Pretendard'] leading-relaxed">
            {title}
          </span>
        )}
      </div>
      <div className="flex justify-end items-center gap-2 w-20">
        <button
          type="button"
          className="cursor-pointer w-6 h-6"
          onClick={handleClickShieldCheck}
        >
          <img src={ShieldCheck} alt="Shield Check" />
        </button>
        <button
          type="button"
          className="cursor-pointer w-6 h-6 relative"
          onClick={handleClickAlarm}
        >
          {hasUnreadNoti?.result && (
            <div
              className="absolute right-0 w-2 h-2 rounded-full bg-red-500"
              aria-label="읽지 않은 알림 존재"
            ></div>
          )}
          <img src={Alarm} alt="알람" />
        </button>
      </div>
    </header>
  );
};

export default AlarmHeader;
