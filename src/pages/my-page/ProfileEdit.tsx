import { useState, useRef } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useProfileStore } from '../../stores/profile-store';

export default function ProfileEdit() {
  const {
    name,
    setName,
    nickname,
    setNickname,
    gender,
    setGender,
    birthdate,
    setBirthdate,
    profileImage,
    setProfileImage,
    bio,
    setBio,
  } = useProfileStore();

  const [isNicknameChecked, setIsNicknameChecked] = useState(true); // 수정 시 기존 닉네임 사용 가능
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckNickname = () => {
    if (!nickname) return;
    setIsNicknameChecked(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!isNicknameChecked) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }
    alert('프로필이 수정되었습니다.');
  };

  return (
    <div className="bg-white relative flex flex-col items-center px-6 pb-6 font-Pretendard">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <h1 className="text-[24px] font-bold mb-8 text-center">프로필 수정하기</h1>

      <div className="relative mb-10">
        <img
          src={profileImage}
          alt="프로필 이미지"
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
              placeholder="이름"
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
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameChecked(false);
                }}
                className="w-full border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
              />
            </div>
            <Button
              size="small"
              variant="primary"
              onClick={handleCheckNickname}
            >
              중복확인
            </Button>
          </div>
          {isNicknameChecked && (
            <p className="mt-1 text-sm text-[#F78938]">
              사용 가능한 닉네임입니다.
            </p>
          )}
        </div>

        {/* 성별 */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium">성별</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 py-2 rounded-[12px] border border-[#F78938] transition-colors duration-200 ${
                gender === '남자'
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#5D5D5D]'
              } hover:bg-[#F78938] hover:text-white`}
              onClick={() => setGender('남자')}
            >
              남자
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-[12px] border border-[#F78938] transition-colors duration-200 ${
                gender === '여자'
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#5D5D5D]'
              } hover:bg-[#F78938] hover:text-white`}
              onClick={() => setGender('여자')}
            >
              여자
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium">생년월일</label>
          <div className="border-b border-gray-300 pb-2">
            <Input
              type="text"
              placeholder="생년월일"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        {/* 한 줄 소개 */}
        <div className="flex flex-col gap-2 mb-8">
          <label className="text-[16px] font-medium">한 줄 소개
             <span className="text-sm text-[#666666] ml-2">*선택</span>
          </label>
          <div className="border-b border-gray-300 pb-2">
            <Input
              type="text"
              placeholder="한 줄 소개를 입력해주세요"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        <Button
          size="large"
          variant="primary"
          onClick={handleSave}
          disabled={!name || !nickname || !gender || !birthdate}
        >
          프로필 수정 완료
        </Button>
      </div>
    </div>
  );
}
