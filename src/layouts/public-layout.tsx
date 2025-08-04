import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const AppLayout = () => {
  return (
    <>
    <div className="px-4">
      <Outlet />
    </div>
    <Navbar/>
    </>
  );
};

export default AppLayout;
