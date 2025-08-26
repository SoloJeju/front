import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../stores/profile-store';

type MenuItemProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

const MenuItem = ({ to, children, className = '' }: MenuItemProps) => (
  <Link
    to={to}
    className={`block py-3 text-[#262626] text-base tracking-[-0.02em] font-medium ${className}`}
  >
    {children}
  </Link>
);

const MyPage = () => {
  const navigate = useNavigate();
  const { nickname, type, profileImage } = useProfileStore();

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠어요?')) {
      alert('로그아웃 되었습니다.');
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen bg-white font-Pretendard">
      <header className="bg-[#F78938] h-59" />

      <main className="relative -mt-45 mx-4">
        <section className="flex flex-col items-center text-center mb-6">
          {/* 프로필 사진 */}
          <div className="relative w-24 h-24 mb-4">
            <img
              src={profileImage}
              alt="프로필 이미지"
              className="w-full h-full rounded-full shadow-md object-cover"
            />
          </div>

          {/* 프로필 수정 버튼 */}
          <Link
            to="/mypage/profile-edit"
            className="absolute top-0 right-0 -translate-y-10 bg-[#F78938] text-white text-xs px-2 py-1 rounded-[20px] border border-white hover:bg-[#F78938]/90 transition-colors"
          >
            프로필 수정
          </Link>

          {/* 여행자 타입 */}
          <span className="text-sm text-white tracking-[-0.02em] cursor-default">
            {type || '여행 성향이 떠야 하는 부분'}
          </span>

          {/* 닉네임 */}
          <h2 className="text-xl font-SemiBold text-white cursor-default">
            {nickname}
          </h2>
        </section>

        <div className="p-4">
          <section className="mb-6 border-b-[0.5px] border-[#D9D9D9]">
            <h3 className="text-[#737373] text-sm mb-2 font-medium tracking-[-0.02em] cursor-default">
              내 활동
            </h3>
            <MenuItem to="/mypage/plans">여행 계획</MenuItem>
            <MenuItem to="/mypage/rooms">동행방 리스트 보기</MenuItem>
            <MenuItem to="/mypage/reviews" className="border-b-0">
              내가 작성한 리뷰 보기
            </MenuItem>
          </section>

          <section className="mb-6 border-b-[0.5px] border-[#D9D9D9]">
            <h3 className="text-[#737373] text-sm mb-2 font-medium tracking-[-0.02em] cursor-default">
              커뮤니티 활동
            </h3>
            <MenuItem to="/mypage/posts">내가 작성한 글</MenuItem>
            <MenuItem to="/mypage/bookmarks">내가 스크랩한 글</MenuItem>
            <MenuItem to="/mypage/comments" className="border-b-0">
              내가 댓글 단 글
            </MenuItem>
          </section>

          <section>
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
            <MenuItem to="/mypage/contact">1:1 문의하기</MenuItem>
            <MenuItem to="/mypage/terms">서비스 이용약관</MenuItem>
            <MenuItem to="/mypage/privacy">개인정보 처리방침</MenuItem>
            <button
              onClick={handleLogout}
              className="w-full text-left py-3 text-gray-800 text-base"
            >
              로그아웃
            </button>
            <Link
              to="/mypage/delete"
              className="block w-full text-left py-3 text-[#262626] text-base"
            >
              탈퇴하기
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
