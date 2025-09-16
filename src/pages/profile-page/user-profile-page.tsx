import { useNavigate, useParams } from 'react-router-dom';
import Back from '/src/assets/beforeArrow.svg';
import More from '/src/assets/more.svg';
import BasicProfile from '/src/assets/basicProfile.png';
import { useEffect, useRef, useState } from 'react';
import ProfileModal from '../../components/ProfilePage/ProfileModal';

import { useOtherUserProfile } from '../../hooks/mypage/useOtherUserProfile';
import useGetMyInfo from '../../hooks/mypage/useGetMyInfo';

export default function UserProfilePage() {
  const { userId } = useParams();
  console.log(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalBg = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleNavigate = () => navigate(-1);

  const {
    data: myInfoData,
    isLoading: isMyLoading,
    isError: isMyError,
  } = useGetMyInfo();
  const myUserId = myInfoData?.result?.userId;

  const numericUserId = Number(userId);
  const hasValidParamId = Number.isFinite(numericUserId);

  if (!hasValidParamId) {
    return (
      <div className="flex items-center justify-center h-screen">
        잘못된 접근입니다.
      </div>
    );
  }

  const isMyProfile = !!myUserId && myUserId === numericUserId;

  const {
    data: otherUserData,
    isLoading: isOtherUserLoading,
    isError: isOtherUserError,
  } = useOtherUserProfile(numericUserId);

  const userProfile = isMyProfile ? myInfoData?.result : otherUserData?.result;

  const isLoading = isMyProfile ? isMyLoading : isOtherUserLoading;
  const isError = isMyProfile ? isMyError : isOtherUserError;

  useEffect(() => {
    const handleClickModalBg = (e: MouseEvent) => {
      if (
        isModalOpen &&
        modalBg.current &&
        !modalBg.current.contains(e.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickModalBg);
    return () => document.removeEventListener('mousedown', handleClickModalBg);
  }, [isModalOpen]);

  const handleModify = () => {
    navigate('/mypage/profile-edit');
  };

  if (isLoading || (!userProfile && !isError)) {
    return (
      <div className="flex items-center justify-center h-screen">
        프로필 불러오는 중…
      </div>
    );
  }
  if (isError || !userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        사용자 정보를 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="h-full p-5 bg-[#F78938]">
      <button type="button" onClick={handleNavigate} className="cursor-pointer">
        <img src={Back} alt="뒤로가기" />
      </button>

      <div className="flex flex-col px-5 py-6 mt-9 bg-[#FFFFFD] rounded-[20px] relative">
        <button
          type="button"
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          aria-label="더보기"
        >
          <img src={More} alt="" />
        </button>

        <img
          src={userProfile.imageUrl || BasicProfile}
          alt={`${userProfile.nickName}님의 프로필`}
          className="w-50 h-50 object-cover mt-5 mb-14 flex self-center rounded-full"
        />

        <h1 className="mb-3 font-[pretendard] font-semibold text-2xl text-black">
          {userProfile.nickName}
        </h1>
        <p className="mb-3 font-[pretendard] font-normal text-xl text-[#666666]">
          {userProfile.userType}
        </p>
        <p className="w-full pb-4.5 border-b-2 border-[#FFCEAA] font-[pretendard] font-normal text-base text-[#666666]">
          {userProfile.bio ? `“${userProfile.bio}”` : ''}
        </p>

        <table className="mt-4.5 w-full">
          <tbody>
            <tr className="flex justify-between ">
              <td className="font-[pretendard] font-normal text-base text-black">
                동행방 경험
              </td>
              <td className="font-[pretendard] font-normal text-base text-black">
                {userProfile.groupChatCount ?? 0}회
              </td>
            </tr>
            <tr className="flex justify-between ">
              <td className="font-[pretendard] font-normal text-base text-black">
                혼행 경험
              </td>
              <td className="font-[pretendard] font-normal text-base text-black">
                {userProfile.soloPlanCount ?? 0}회
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="absolute top-45 right-10">
          <ProfileModal
            ref={modalBg}
            onModify={handleModify}
            onReport={() => navigate(`/report?targetUserId=${userId}`)}
            onBlock={() => console.log('차단 실행')}
          />
        </div>
      )}
    </div>
  );
}
