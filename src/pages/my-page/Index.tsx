import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutModal from './modal/LogoutModal';
import DeleteAccountModal from './modal/DeleteAccountModal';
import { logout } from '../../apis/auth';
import toast from 'react-hot-toast';
import { useUnreadMessages } from '../../hooks/mypage/useUnreadMessages';
import useGetMyInfo from '../../hooks/mypage/useGetMyInfo';
import { useDeleteProfile } from '../../hooks/mypage/useDeleteAccount';

type MenuItemProps = {
  to?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const MenuItem = ({ to, children, className = '', onClick }: MenuItemProps) =>
  to ? (
    <Link
      to={to}
      className={`block py-3 text-[#262626] text-base tracking-[-0.02em] font-medium cursor-pointer ${className}`}
    >
      {children}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full text-left py-3 text-[#262626] text-base tracking-[-0.02em] font-medium cursor-pointer ${className}`}
    >
      {children}
    </button>
  );

const MyPage = () => {
  const navigate = useNavigate();
  const { data: myInfoResponse, isLoading, isError } = useGetMyInfo();
  const { data: unreadMessagesData } = useUnreadMessages();
  const profile = myInfoResponse?.result;

  const DEFAULT_PROFILE = '/default-profile.svg';
  const imageUrl = profile?.imageUrl || DEFAULT_PROFILE;
  const userType = profile?.userType ?? '—';
  const nickName = profile?.nickName ?? '—';
  const soloCount = profile?.soloPlanCount ?? 0;
  const groupCount = profile?.groupChatCount ?? 0;

  const hasUnreadMessages = unreadMessagesData?.result;

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const openLogout = () => setLogoutOpen(true);
  const closeLogout = () => setLogoutOpen(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 API 실패:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggingOut(false);
      closeLogout();
      navigate('/login');
    }
  };

  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteProfile();
  const openDelete = () => setDeleteOpen(true);
  const closeDelete = () => setDeleteOpen(false);

  const handleDeleteConfirm = (payload: {
    reason: string;
    detail?: string;
  }) => {
    console.log('탈퇴 사유:', payload);
    deleteAccount();
  };

  if (isLoading) {
    return <div>내 정보를 불러오는 중입니다...</div>;
  }

  if (isError) {
    return <div>오류가 발생하여 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="relative min-h-screen bg-white font-[Pretendard]">
      <header className="relative bg-[#F78938]">
        <div className="px-4 pt-4 pb-2">
          <Link
            to="/mypage/profile-edit"
            className="float-right bg-[#F78938] text-white text-[12px] px-3 py-[6px] rounded-full border border-white/70 hover:bg-[#F78938]/90 transition-colors"
          >
            프로필 수정
          </Link>
          <div className="clear-both" />
        </div>

        {/* 프로필 정보 */}
        <div className="px-4 pb-4 flex flex-col items-center text-center">
          <div className="w-[88px] h-[88px] mb-2">
            <img
              src={imageUrl}
              alt="프로필 이미지"
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = DEFAULT_PROFILE;
              }}
            />
          </div>
          <span className="text-[13px] text-white/90 tracking-[-0.02em]">
            {userType}
          </span>
          <h2 className="mt-0.5 text-[20px] font-semibold text-white">
            {nickName}
          </h2>
        </div>

        {/* 혼행/동행방 횟수 */}
        <nav className="grid grid-cols-2 text-white/95 border-[0.5px] border-[#AF5A1C]">
          <div className="py-[10px] text-center border-r-[0.5px] border-[#AF5A1C]">
            <span className="text-[14px] text-[#FFCEAA] align-middle">
              혼행
            </span>
            <span className="ml-2 text-[14px] font-medium align-middle">
              {soloCount}회
            </span>
          </div>
          <div className="py-[10px] text-center">
            <span className="text-[14px] text-[#FFCEAA] align-middle">
              동행방
            </span>
            <span className="ml-2 text-[14px] font-medium align-middle">
              {groupCount}회
            </span>
          </div>
        </nav>
      </header>

      {/* 본문 */}
      <main className="mx-4 pb-12">
        {/* 내 활동 */}
        <section className="mt-6 border-b border-[#EDEDED]">
          <h3 className="text-[#737373] text-sm mb-2 font-medium tracking-[-0.02em] cursor-default">
            내 활동
          </h3>
          <MenuItem to="/mypage/plans">여행 계획</MenuItem>
          <MenuItem to="/mypage/rooms" className="relative">
            동행방 리스트 보기
            {hasUnreadMessages && (
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </MenuItem>
          <MenuItem to="/mypage/reviews" className="mb-3">
            내가 작성한 리뷰 보기
          </MenuItem>
        </section>

        {/* 커뮤니티 활동 */}
        <section className="mt-6 border-b border-[#EDEDED]">
          <h3 className="text-[#737373] text-sm mb-2 font-medium tracking-[-0.02em] cursor-default">
            커뮤니티 활동
          </h3>
          <MenuItem to="/mypage/posts">내가 작성한 글</MenuItem>
          <MenuItem to="/mypage/bookmarks">내가 스크랩한 글</MenuItem>
          <MenuItem to="/mypage/comments" className="mb-3">
            내가 댓글 단 글
          </MenuItem>
        </section>

        {/* 기타 */}
        <section className="mt-6">
          <h3 className="text-[#737373] text-sm mb-2 font-medium tracking-[-0.02em] cursor-default">
            기타
          </h3>

          <Link
            to="/mypage/language"
            className="flex justify-between items-center py-3 text-gray-800 text-base"
          >
            <span>언어</span>
            <span className="text-[14px] text-[#737373]">한국어</span>
          </Link>

          <MenuItem to="/inquiry/my">내 문의 내역</MenuItem>
          <MenuItem to="/report/my">내 신고 내역</MenuItem>
          <MenuItem to="/mypage/terms">서비스 이용약관</MenuItem>
          <MenuItem to="/mypage/privacy">개인정보 처리방침</MenuItem>
          <MenuItem onClick={openLogout}>로그아웃</MenuItem>
          <MenuItem onClick={openDelete} disabled={isDeleting}>
            탈퇴하기
          </MenuItem>
        </section>
      </main>

      <LogoutModal
        open={logoutOpen}
        onClose={closeLogout}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
      <DeleteAccountModal
        open={deleteOpen === true}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default MyPage;
