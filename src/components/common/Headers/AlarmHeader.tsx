import { useNavigate } from 'react-router-dom';
import Alarm from '../../../assets/alarmIcon.svg';
import Logo from '../../../assets/logo-home.svg';

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
      <div className="w-6 h-6 flex justify-end">
        <button
          type="button"
          className="cursor-pointer w-6 h-6"
          onClick={handleClickAlarm}
        >
          <img src={Alarm} alt="알람" />
        </button>
      </div>
    </header>
  );
};

export default AlarmHeader;
