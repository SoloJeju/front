import { useNavigate, useParams } from 'react-router-dom';
import Back from '/src/assets/beforeArrow.svg';
import More from '/src/assets/more.svg';
import BasicProfile from '/src/assets/basicProfile.png';
import { useEffect, useRef, useState } from 'react';
import ProfileModal from '../../components/ProfilePage/ProfileModal';

export default function UserProfilePage() {
  const { userId } = useParams();
  console.log(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalBg = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };

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
    return () => document.addEventListener('mousedown', handleClickModalBg);
  }, [isModalOpen]);

  const handleModify = () => {
    navigate('/my');
  };

  return (
    <div className="h-full p-5 bg-[#F78938]">
      <button type="button" onClick={handleNavigate}>
        <img src={Back} alt="뒤로가기" />
      </button>

      <div className="flex flex-col px-5 py-6 mt-9 bg-[#FFFFFD] rounded-[20px] relative">
        <button
          type="button"
          className="absolute top-5 right-5"
          onClick={() => setIsModalOpen(true)}
        >
          <img src={More} alt="더보기" />
        </button>

        <img
          src={BasicProfile}
          alt={`사용자님의 프로필`}
          className="w-50 h-50 object-cover mt-5 mb-14 flex self-center"
        />

        <h1 className="mb-3 font-[pretendard] font-semibold text-2xl text-black">
          홍길동
        </h1>
        <p className="w-full pb-4.5 border-b-2 border-[#FFCEAA] font-[pretendard] font-normal text-xl text-[#666666]">
          감성 여유형 여행자
        </p>
        <table className="mt-4.5 w-full">
          <tbody>
            <tr className="flex justify-between ">
              <td className="font-[pretendard] font-normal text-base text-black">
                동행방 경험
              </td>
              <td className="font-[pretendard] font-normal text-base text-black">
                3회
              </td>
            </tr>
            <tr className="flex justify-between ">
              <td className="font-[pretendard] font-normal text-base text-black">
                혼행 경험
              </td>
              <td className="font-[pretendard] font-normal text-base text-black">
                3회
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
            onReport={() => console.log('신고 실행')}
            onBlock={() => console.log('차단 실행')}
          />
        </div>
      )}
    </div>
  );
}
