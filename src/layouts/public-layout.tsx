import { matchPath, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AlarmHeader from '../components/common/Headers/AlarmHeader';
import BackHeader from '../components/common/Headers/BackHeader';

const AppLayout = () => {
  const location = useLocation();
  const isHomePage = !!matchPath({ path: '/', end: true }, location.pathname);
  const isCommunityPage = !!matchPath(
    { path: '/community', end: true },
    location.pathname
  );
  const isSearchDetail = !!matchPath(
    { path: 'search-detail/:placeId' },
    location.pathname
  );
  const isSearchBoxPage = !!matchPath(
    { path: 'search-box' },
    location.pathname
  );

  // Navbar 숨길 페이지!!
  const hideNavbarPaths = ['/login', '/signup', '/find-password','/splash'];
  const shouldHideNavbar = hideNavbarPaths.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full min-h-screen max-w-[480px] flex flex-col justify-between bg-[#FFFFFD]">
        {isHomePage && <AlarmHeader showLogo={true} />}
        {isCommunityPage && <BackHeader title="커뮤니티" />}
        <div className={`flex-1 ${isSearchDetail?'':'px-6'} ${isSearchDetail || isSearchBoxPage?'':'pt-15'} pb-15`}>
          <Outlet />
        </div>
        {!shouldHideNavbar && <Navbar />}
      </div>
    </div>
  );
};

export default AppLayout;
