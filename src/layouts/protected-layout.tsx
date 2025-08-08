import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const AppLayout = () => {
  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col justify-between bg-[#FFFFFD]">
        <div className="flex-1 px-4 pt-15 pb-15">
          <Outlet />
        </div>
        <Navbar />
      </div>
    </div>
  );
};

export default AppLayout;
