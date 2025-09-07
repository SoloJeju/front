import { useState, useRef, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useProfileStore, initialState } from '../../stores/profile-store';
import editIcon from '../../assets/edit-icon.svg';
import toast from 'react-hot-toast';
import { checkNickname as apiCheckNickname } from '../../apis/auth';
import { updateMyProfile } from '../../apis/mypage';

const MAX_BIO_LEN = 25;

export default function ProfileEdit() {
  const { nickName, setNickName, profileImage, setProfileImage, bio, setBio } =
    useProfileStore();

  // 원래 닉네임: 변경 여부 판단용
  const originalNickname = useRef(nickName);

  const [isNicknameChecked, setIsNicknameChecked] = useState(true); // 초기엔 '변경 안 함'이므로 통과
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [bioLen, setBioLen] = useState<number>(
    bio ? Math.min(bio.length, MAX_BIO_LEN) : 0
  );

  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setBioLen(bio ? Math.min(bio.length, MAX_BIO_LEN) : 0);
  }, [bio]);

  // 팝오버 닫기: ESC / 바깥 클릭
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

  // 닉네임 변경 시: 원래 값과 다르면 중복확인 다시 요구
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setNickName(next);
    setIsNicknameChecked(next === originalNickname.current);
  };

  // 닉네임 중복확인 API
  const handleCheckNickname = async () => {
    if (!nickName) return;
    if (nickName === originalNickname.current) {
      setIsNicknameChecked(true);
      toast.success('현재 닉네임 그대로 사용합니다.');
      return;
    }

    try {
      setIsChecking(true);
      const res = await apiCheckNickname({ nickName: nickName });
      if (res.isSuccess) {
        setIsNicknameChecked(true);
        toast.success(res.result || '사용 가능한 닉네임입니다.');
      } else {
        setIsNicknameChecked(false);
        toast.error(res.message || '사용할 수 없는 닉네임입니다.');
      }
    } catch (e) {
      setIsNicknameChecked(false);
      console.error('에러 발생:', e);
      toast.error('닉네임 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  // 프로필 사진 업로드(미리보기용 dataURL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadFromMenu = () => {
    fileInputRef.current?.click();
    closeProfileMenu();
  };

  const handleResetToDefault = () => {
    setProfileImage(initialState.profileImage);
    if (fileInputRef.current) fileInputRef.current.value = '';
    closeProfileMenu();
  };

  // 한 줄 소개 25자 제한
  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? '';
    const trimmed = v.slice(0, MAX_BIO_LEN);
    setBio(trimmed);
    setBioLen(trimmed.length);
  };

  // 저장 가능 조건: 닉네임 존재 + (닉네임 안 바꿈 || 중복확인 완료) + 저장중 아님
  const canSave =
    !!nickName &&
    (nickName === originalNickname.current || isNicknameChecked) &&
    !isSaving;

  // 저장: PATCH /api/mypage/profile
  const handleSave = async () => {
    if (!canSave) {
      alert('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    // 서버에 보낼 payload 구성 (변경된 것만)
    const payload: {
      nickName?: string;
      imageName?: string;
      imageUrl?: string;
      bio?: string;
    } = {};

    // 닉네임 변경 시에만 포함
    if (nickName !== originalNickname.current) {
      payload.nickName = nickName;
    }

    // 이미지 정책
    const isDefault = profileImage === initialState.profileImage;

    if (isDefault) {
      // 기본 이미지로 저장
      payload.imageName = 'default-profile.svg';
      payload.imageUrl = '';
    } else if (/^https?:\/\//.test(profileImage)) {
      // URL 이미지(예: 카카오 URL)
      const fileNameFromUrl = profileImage.split('/').pop() || 'profile.jpg';
      payload.imageName = fileNameFromUrl;
      payload.imageUrl = profileImage;
    } else if (profileImage.startsWith('data:image/')) {
      // dataURL(로컬 업로드 미리보기) → 서버가 URL만 허용하면 업로드 API가 필요
      // TODO: 이미지 업로드 API 연동 후, 업로드 URL을 imageUrl로 전달
      toast('로컬 업로드 이미지는 아직 서버 저장을 지원하지 않습니다.', {
        icon: 'ℹ️',
      });
    }

    // bio(선택)
    if (bio) payload.bio = bio.slice(0, MAX_BIO_LEN);

    // 변경 없으면 리턴
    if (
      !payload.nickName &&
      !payload.imageName &&
      !payload.imageUrl &&
      payload.bio === undefined
    ) {
      toast('변경사항이 없습니다.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await updateMyProfile(payload);
      if (res.isSuccess) {
        toast.success('프로필이 수정되었습니다.');
        // 닉네임 원본 갱신 + 버튼 상태 초기화
        originalNickname.current = nickName;
        setIsNicknameChecked(true);
      } else {
        toast.error(res.message || '수정에 실패했습니다.');
      }
    } catch {
      toast.error('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
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

      <h1 className="text-[24px] font-bold mb-8 text-center">
        프로필 수정하기
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
          <div className="w-32 h-32 rounded-full bg-[#F5F5F5] grid place-items-center text-sm text-[#737373]">
            기본 이미지
          </div>
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

        {/* 팝오버 */}
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

            {/* 기본 이미지 상태면 비활성화하되 항목은 항상 노출 */}
            <button
              type="button"
              onClick={
                profileImage !== initialState.profileImage
                  ? handleResetToDefault
                  : undefined
              }
              disabled={profileImage === initialState.profileImage}
              role="menuitem"
              className={`w-full text-left px-4 py-3 outline-none ${
                profileImage === initialState.profileImage
                  ? 'text-[#262626]/40 cursor-default'
                  : 'text-[#262626] focus:bg-gray-50 cursor-pointer'
              }`}
            >
              기본 이미지로 변경
            </button>
          </div>
        )}
      </div>

      {/* 닉네임 */}
      <div className="w-full flex flex-col gap-2">
        <label className="text-[16px] font-medium">닉네임</label>
        <div className="flex items-center gap-4 border-b border-gray-300 pb-2">
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="닉네임"
              value={nickName}
              onChange={handleNicknameChange}
              className="w-full border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
            />
          </div>
          <Button
            size="small"
            variant="primary"
            onClick={handleCheckNickname}
            disabled={!nickName || isChecking}
          >
            {isChecking ? '확인중…' : '중복확인'}
          </Button>
        </div>
        {nickName !== originalNickname.current && isNicknameChecked && (
          <p className="mt-1 text-sm text-[#F78938]">
            사용 가능한 닉네임입니다.
          </p>
        )}
      </div>

      {/* 한 줄 소개 (선택, 25자 제한) */}
      <div className="w-full flex flex-col gap-2 mt-6 mb-8">
        <label className="text-[16px] font-medium">
          한 줄 소개 <span className="text-sm text-[#666666] ml-2">*선택</span>
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
        onClick={handleSave}
        disabled={!canSave}
      >
        {isSaving ? '저장 중…' : '저장하기'}
      </Button>
    </div>
  );
}
