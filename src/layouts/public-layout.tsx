import { matchPath, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AlarmHeader from '../components/common/Headers/AlarmHeader';

const AppLayout = () => {
  const location = useLocation();
  const isHomePage = !!matchPath({ path: '/', end: true }, location.pathname);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full min-h-screen max-w-[480px] flex flex-col justify-between bg-[#FFFFFD]">
        {isHomePage && <AlarmHeader showLogo={true} />}
        <div className="flex-1 px-4 pt-15 pb-15">
          <Outlet />
        </div>
        <Navbar />
      </div>
    </div>
  );
};

export default AppLayout;
