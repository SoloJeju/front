import { useNavigate } from 'react-router-dom';
import Alarm from '../../../assets/alarmIcon.svg';

interface AlarmHeaderProps {
  title?: string;
}

const AlarmHeader = ({ title }: AlarmHeaderProps) => {
  const navigate = useNavigate();

  const handleClickAlarm = () => {
    navigate('/alarm');
  };

  return (
    <header className="w-full py-3 flex items-center justify-between">
      <div className="w-6 h-6"></div>
      <div className="justify-start text-black-2 text-lg font-semibold font-['Pretendard'] leading-relaxed">{title}</div>
      <button type="button" className="cursor-pointer w-6 h-6" onClick={handleClickAlarm}>
        <img src={Alarm} alt="알람" />
      </button>
    </header>
  );
};

export default AlarmHeader;