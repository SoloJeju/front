// 기본 정보 입력 화면
import { useState, useRef, useEffect } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useProfileStore } from '../../../stores/profile-store';
import defaultProfile from '../../../assets/profileDefault.svg';
import editIcon from '../../../assets/edit-icon.svg';

const MAX_BIO_LEN = 25;
const DEFAULT_PROFILE = defaultProfile;

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
    profileImage,
    setProfileImage,
    bio,
    setBio,
  } = useProfileStore();

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [bioLen, setBioLen] = useState<number>(bio ? bio.length : 0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setBioLen(bio ? Math.min(bio.length, MAX_BIO_LEN) : 0);
  }, [bio]);

  // 팝오버: ESC/바깥 클릭 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setIsProfileMenuOpen(false);
    const onClickOutside = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node))
        setIsProfileMenuOpen(false);
    };
    if (isProfileMenuOpen) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', onClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [isProfileMenuOpen]);

  const openProfileMenu = () => setIsProfileMenuOpen(true);
  const closeProfileMenu = () => setIsProfileMenuOpen(false);

  // 닉네임 중복확인 (임시)
  const handleCheckNickname = () => {
    if (!nickname) return;
    setIsNicknameChecked(true);
  };

  // 이미지 업로드
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // 팝오버 액션
  const handleUploadFromMenu = () => {
    fileInputRef.current?.click();
    closeProfileMenu();
  };
  const handleResetToDefault = () => {
    setProfileImage(DEFAULT_PROFILE);
    if (fileInputRef.current) fileInputRef.current.value = '';
    closeProfileMenu();
  };

  // 한 줄 소개(25자 제한)
  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? '';
    const trimmed = v.slice(0, MAX_BIO_LEN);
    setBio(trimmed);
    setBioLen(trimmed.length);
  };

  const isFormValid =
    !!name && !!nickname && !!gender && !!birthdate && isNicknameChecked;

  return (
    <div className="bg-white relative flex flex-col items-center px-6 pb-6 font-Pretendard">
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

      {/* 프로필 이미지 + 연필(팝오버 트리거) */}
      <div className="relative mb-10">
        {profileImage ? (
          <img
            src={profileImage}
            alt="프로필 이미지"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-full bg-[#F5F5F5] grid place-items-center text-sm text-[#737373]"
            aria-label="프로필 이미지 업로드"
            title="프로필 이미지 업로드"
          >
            이미지 추가
          </button>
        )}

        <button
          type="button"
          onClick={openProfileMenu}
          aria-haspopup="menu"
          aria-expanded={isProfileMenuOpen}
          className="absolute bottom-1 right-1 p-1 cursor-pointer"
          title="프로필 이미지 변경"
        >
          <img src={editIcon} alt="프로필 이미지 변경" className="w-6 h-6" />
        </button>

        {/* 팝오버: 아바타 하단 중앙 */}
        {isProfileMenuOpen && (
          <div
            ref={menuRef}
            role="menu"
            className={[
              'absolute left-1/2 top-full mt-2 -translate-x-1/2',
              'w-45 rounded-xl',
              'bg-white/90 backdrop-blur-sm ring-1 ring-black/5 shadow-md',
              'transition-all duration-150 ease-out translate-y-0 opacity-100',
              'overflow-hidden z-10',
            ].join(' ')}
          >
            <button
              type="button"
              onClick={handleUploadFromMenu}
              role="menuitem"
              autoFocus
              className="w-full text-left px-4 py-3 text-[#262626] outline-none focus:bg-gray-50 cursor-pointer"
            >
              사진 변경
            </button>

            <div className="h-px bg-[#EDEDED]" />

            {/* 기본 이미지 상태면 비활성화(항상 노출) */}
            <button
              type="button"
              onClick={
                profileImage !== DEFAULT_PROFILE
                  ? handleResetToDefault
                  : undefined
              }
              disabled={profileImage === DEFAULT_PROFILE}
              role="menuitem"
              className={`w-full text-left px-4 py-3 outline-none ${
                profileImage === DEFAULT_PROFILE
                  ? 'text-[#262626]/40 cursor-default'
                  : 'text-[#262626] focus:bg-gray-50 cursor-pointer'
              }`}
            >
              기본 이미지로 변경
            </button>
          </div>
        )}
      </div>

      {/* 입력 폼 */}
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
                  setIsNicknameChecked(false); // 닉네임 변경 시 중복확인 초기화
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
              placeholder="생년월일을 입력해주세요"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        {/* 한 줄 소개 (선택 입력, 25자 제한) */}
        <div className="flex flex-col gap-2 mb-8">
          <label className="text-[16px] font-medium">
            한 줄 소개{' '}
            <span className="text-sm text-[#666666] ml-2">*선택</span>
          </label>
          <div className="border-b border-gray-300 pb-2">
            <Input
              type="text"
              placeholder="한 줄 소개를 입력해주세요"
              value={bio}
              onChange={handleBioChange}
              maxLength={MAX_BIO_LEN}
              className="w-full border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="text-xs text-[#999999] text-right">
            {bioLen}/{MAX_BIO_LEN}
          </div>
        </div>

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
