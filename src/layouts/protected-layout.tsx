import { matchPath, Outlet, useLocation } from 'react-router-dom';
import BackHeader from '../components/common/Headers/BackHeader';

const AppLayout = () => {
  const location = useLocation();
  const isAlarmPage = !!matchPath({ path: '/alarm' }, location.pathname);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col justify-between bg-[#FFFFFD]">
        {isAlarmPage && <BackHeader title="알림" />}
        <div className="flex-1 px-4 pt-15 pb-15">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
