import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-[480px] flex flex-col justify-between bg-[#FFFFFD]">
        <div className="flex-1 px-4 pt-15">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
