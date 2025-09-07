import { matchPath, Outlet, useLocation } from 'react-router-dom';
import BackHeader from '../components/common/Headers/BackHeader';

const AppLayout = () => {
  const location = useLocation();
  const isAlarmPage = !!matchPath({ path: '/alarm' }, location.pathname);
  const isCommunityDetailPage = !!matchPath(
    { path: '/community/:postId' },
    location.pathname
  );
  const isCommunityWritePage = !!matchPath(
    { path: '/community/new-post' },
    location.pathname
  );
  const isReviewWritePage = !!matchPath({ path: '/write-review' }, location.pathname);
  const isPlanPage = !!matchPath({ path: '/plan' }, location.pathname);
  const isPlanDetailPage = !!matchPath({ path: '/plan/:planId' }, location.pathname);
  const isCreateRoomPage = !!matchPath({ path: '/create-room' }, location.pathname);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col justify-between bg-[#FFFFFD]">
        {isAlarmPage && <BackHeader title="알림" />}
        {isCommunityDetailPage && <BackHeader title="게시글" />}
        {isCommunityWritePage && <BackHeader title="게시글 작성" />}
        {isReviewWritePage && <BackHeader title="리뷰 작성"/>}
        {isPlanPage && <BackHeader title="계획 짜기"/>}
        {isPlanDetailPage && <BackHeader title="일정 보기"/>}
        {isCreateRoomPage && <BackHeader title="동행방 개설"/>}
        <div className="flex-1 px-4 pt-15 pb-15">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
