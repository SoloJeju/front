import { matchPath, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BackHeader from '../components/common/Headers/BackHeader';
import Navbar from '../components/common/Navbar';
import Modal from '../components/common/Modal';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);
  return isLoggedIn;
};

const ProtectedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isLoggedIn===false) {
      setShowModal(true);
    }
  }, [isLoggedIn, location.pathname]);

  const handleLoginRedirect = () => {
    setShowModal(false);
    navigate('/login');
  };

  const isAlarmPage = !!matchPath({ path: '/alarm' }, location.pathname);
  const isCommunityDetailPage = !!matchPath(
    { path: '/community/:postId' },
    location.pathname
  );
  const isCommunityWritePage = !!matchPath(
    { path: '/community/new-post' },
    location.pathname
  );
  const isReviewWritePage = !!matchPath(
    { path: '/write-review' },
    location.pathname
  );
  const isPlanPage = !!matchPath({ path: '/plan' }, location.pathname);
  const isPlanDetailPage = !!matchPath(
    { path: '/plan/:planId' },
    location.pathname
  );
  const isCreateRoomPage = !!matchPath(
    { path: '/create-room' },
    location.pathname
  );
  const isMyPagePlanPage = !!matchPath(
    { path: '/mypage/plans' },
    location.pathname
  );
  const isMyChatRooms = !!matchPath(
    { path: '/mypage/rooms' },
    location.pathname
  );

  const isChatRoom = !!matchPath(
    { path: 'chat-room/:roomId' },
    location.pathname
  );
  const isMyPageReviewPage = !!matchPath(
    { path: '/mypage/reviews' },
    location.pathname
  );
  const isEditReviewPage = !!matchPath(
    { path: '/edit-review/:reviewId' },
    location.pathname
  );
  const isMyPageRoomPage = !!matchPath(
    { path: '/mypage/rooms' },
    location.pathname
  );

  const isMyPage = matchPath({ path: '/mypage/*' }, location.pathname);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col justify-between bg-[#FFFFFD]">
        {isAlarmPage && <BackHeader title="알림" />}
        {isCommunityDetailPage && <BackHeader title="게시글" />}
        {isCommunityWritePage && <BackHeader title="게시글 작성" />}
        {isReviewWritePage && <BackHeader title="리뷰 작성" />}
        {isEditReviewPage && <BackHeader title="리뷰 수정" />}
        {isPlanPage && <BackHeader title="계획 짜기" />}
        {isPlanDetailPage && <BackHeader title="일정 보기" />}
        {isCreateRoomPage && <BackHeader title="동행방 개설" />}
        {isMyPagePlanPage && <BackHeader title="나의 여행 계획" />}
        {isMyPageReviewPage && <BackHeader title="내가 작성한 리뷰" />}
        {isMyPageRoomPage && <BackHeader title="동행방 리스트" />}
        {isMyChatRooms && <BackHeader title="나의 동행방" />}
        <div className={`flex-1 px-4 pb-15 ${isChatRoom ? '' : 'pt-15 '}`}>
          <Outlet />
        </div>
        {isMyPage && <Navbar />}

        {showModal && (
          <Modal
            title="로그인이 필요한 서비스입니다"
            onClose={() => setShowModal(false)}
            buttons={[
              { text: '로그인하러 가기', onClick: handleLoginRedirect, variant: 'orange' },
            ]}
          >
            로그인 후 혼자옵서예의 더 많은 기능을 만나보세요!
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ProtectedLayout;
