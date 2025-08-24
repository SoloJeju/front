// 기본 정보(이름, 닉네임 등) 입력 화면
import { useState, useRef } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useProfileStore } from '../../../stores/profile-store';

export default function ProfileInfoStep({ onNext }: { onNext: () => void }) {
  const {
    name,
    setName,
    nickname,
    setNickname,
    gender,
    setGender,
    birthdate,
    setBirthdate,
  } = useProfileStore();

  const [isNicknameChecked, setIsNicknameChecked] = useState(false); // 닉네임 확인 여부
  const [profileImage, setProfileImage] = useState('/default-profile.svg'); // 프로필 이미지 미리보기
  const fileInputRef = useRef<HTMLInputElement | null>(null); // 파일 input을 위한 ref

  const isFormValid =
    name && nickname && gender && birthdate && isNicknameChecked;

  // 닉네임 중복 확인 처리 함수
  const handleCheckNickname = () => {
    if (!nickname) {
      return;
    }
    // 실제로는 여기서 API 통신
    // 테스트를 위해 무조건 성공으로 처리
    setIsNicknameChecked(true);
  };

  // 프로필 사진 변경 처리 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white relative flex flex-col items-center px-6 pb-6 font-Pretendard">
      {/* 눈에 보이지 않는 파일 input을 추가 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <h1 className="text-[24px] font-bold mb-8 text-center">
        프로필 생성하기
      </h1>

      <div className="relative mb-10">
        <img
          src={profileImage}
          alt="기본 프로필 이미지"
          className="w-32 h-32 rounded-full object-cover"
        />
        <img
          src="/edit-icon.svg"
          alt="프로필 수정"
          className="w-10 h-10 absolute bottom-0 right-0 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
      </div>

      <div className="w-full flex flex-col gap-4">
        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium">이름</label>
          <div className="border-b border-gray-300 pb-2">
            <Input
              type="text"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium">닉네임</label>
          <div className="flex items-center gap-4 border-b border-gray-300 pb-2">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameChecked(false);
                }}
                className="w-full border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
              />
            </div>
            {/* '중복확인'은 Button 컴포넌트 사용 */}
            <Button
              size="small"
              variant="primary"
              onClick={handleCheckNickname}
            >
              중복확인
            </Button>
          </div>
          {/* 닉네임 확인 완료 메시지를 조건부로 보여줌*/}
          {isNicknameChecked && (
            <p className="mt-1 text-sm text-[#F78938]">
              사용 가능한 닉네임입니다.
            </p>
          )}
        </div>

        {/* 성별 버튼은 일반 <button> 태그 사용 */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium">성별</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 py-2 rounded-[12px] border border-[#F78938] transition-colors duration-200
        ${
          gender === '남자'
            ? 'bg-[#F78938] text-white'
            : 'bg-white text-[#5D5D5D]'
        }
        hover:bg-[#F78938] hover:text-white`}
              onClick={() => setGender('남자')}
            >
              남자
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-[12px] border border-[#F78938] transition-colors duration-200
        ${
          gender === '여자'
            ? 'bg-[#F78938] text-white'
            : 'bg-white text-[#5D5D5D]'
        }
        hover:bg-[#F78938] hover:text-white`}
              onClick={() => setGender('여자')}
            >
              여자
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div className="flex flex-col gap-2 mb-8">
          <label className="text-[16px] font-medium">생년월일</label>
          <div className="border-b border-gray-300 pb-2">
            <Input
              type="text"
              placeholder="생년월일을 입력해주세요"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        {/* '다음으로' 버튼은 Button 컴포넌트 사용 */}
        <Button
          size="large"
          variant="primary"
          disabled={!isFormValid}
          onClick={onNext}
        >
          회원가입 완료
        </Button>
      </div>
    </div>
  );
}
