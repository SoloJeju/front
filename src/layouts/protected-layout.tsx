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
  const isEnterRoom = !!matchPath(
    { path: 'room/:roomId' },
    location.pathname
  );
  const isChatRoom = !!matchPath(
    { path: 'chat-room/:roomId' },
    location.pathname
  );
  const isMyPageTermsPage = !!matchPath(
    { path: '/mypage/terms' },
    location.pathname
  );
  const isMyPagePostsPage = !!matchPath(
    { path: '/mypage/posts' },
    location.pathname
  );
  const isMyPagePrivacyPage = !!matchPath(
    { path: '/mypage/privacy' },
    location.pathname
  );
  const isMyPageBookmarksPage = !!matchPath(
    { path: '/mypage/bookmarks' },
    location.pathname
  );
  const isMyPageCommentsPage = !!matchPath(
    { path: '/mypage/comments' },
    location.pathname
  );
  const isMyPageLanguagePage = !!matchPath(
    { path: '/mypage/language' },
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
  const isAiPlan = !!matchPath(
    { path: 'plan/ai-plan' },
    location.pathname
  );
  const isCartPage = !!matchPath(
    { path: 'cart' }, 
    location.pathname
  );
  const isInquiryPage = !!matchPath(
    { path: 'inquiry/my' }, 
    location.pathname
  );
  const isReportPage = !!matchPath(
    { path: 'report/my' }, 
    location.pathname
  );
  const isMyPageProfileEdit = !!matchPath(
    { path: '/mypage/profile-edit' },
    location.pathname
  );
  const isProfilePage = !!matchPath(
    { path: '/profile/:userId' },
    location.pathname
  );
  const isMyPageAll = matchPath({ path: '/mypage/*' }, location.pathname);
  const isMyPage = matchPath({ path: '/mypage' }, location.pathname);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col justify-between bg-[#FFFFFD]">
        {isAlarmPage && <BackHeader title="알림" />}
        {isCommunityDetailPage && <BackHeader title="게시글" />}
        {isCommunityWritePage && <BackHeader title="게시글 작성" />}
        {isReviewWritePage && <BackHeader title="리뷰 작성" />}
        {isEditReviewPage && <BackHeader title="리뷰 수정" />}
        {isPlanPage && <BackHeader title="계획 짜기" />}
        {isCreateRoomPage && <BackHeader title="동행방 개설" />}
        {isMyPagePlanPage && <BackHeader title="나의 여행 계획" />}
        {isMyPageReviewPage && <BackHeader title="내가 작성한 리뷰" />}
        {isMyPageRoomPage && <BackHeader title="동행방 리스트" />}
        {isMyChatRooms && <BackHeader title="나의 동행방" />}
        {isAiPlan && <BackHeader title="AI 추천 계획 보기" />}
        {isMyPageBookmarksPage && <BackHeader title="내가 스크랩한 글" />}
        {isMyPageCommentsPage && <BackHeader title="내가 댓글 단 글" />}
        {isMyPageLanguagePage && <BackHeader title="언어 설정" />}
        {isMyPageTermsPage && <BackHeader title="서비스 이용약관" />}
        {isMyPagePrivacyPage && <BackHeader title="개인정보 처리방침" />}
        {isMyPagePostsPage && <BackHeader title="내가 작성한 글" />}
        {isMyPageProfileEdit && <BackHeader title="프로필 수정하기" />}
        
        <div className={`flex-1 ${isChatRoom || isMyPage || isPlanDetailPage || isCartPage || isInquiryPage || isReportPage || isEnterRoom || isProfilePage  ? '' : 'px-6'} ${isEnterRoom || isProfilePage ? '' : 'pb-15 '} ${isChatRoom || isPlanDetailPage || isMyPage ||isCartPage|| isInquiryPage || isReportPage || isEnterRoom || isProfilePage ? '' : 'pt-15 '}`}>
          <Outlet />
        </div>
        {isMyPageAll && <Navbar />}

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
