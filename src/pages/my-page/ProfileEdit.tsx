import { useState, useRef, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useProfileStore, initialState } from '../../stores/profile-store';
import editIcon from '../../assets/edit-icon.svg';
import toast from 'react-hot-toast';
import { checkNickname as apiCheckNickname } from '../../apis/auth';
import { updateMyProfile } from '../../apis/mypage';
import { useQueryClient } from '@tanstack/react-query';
import BackHeader from '../../components/common/Headers/BackHeader';
import { validateImageFile, uploadImageToS3 } from '../../apis/s3';

const MAX_BIO_LEN = 25;

export default function ProfileEdit() {
  const { nickName, setNickName, profileImage, setProfileImage, bio, setBio } =
    useProfileStore();
  const qc = useQueryClient();

  // 원래 닉네임(변경 여부 판단)
  const originalNickname = useRef(nickName);

  // UI 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
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

  // 팝오버: ESC/바깥 클릭으로 닫힘
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

  // 닉네임 입력 → 원래 값과 다르면 중복확인 필요
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setNickName(next);
    setIsNicknameChecked(next === originalNickname.current);
  };

  // 닉네임 중복확인
  const handleCheckNickname = async () => {
    if (!nickName) return;
    if (nickName === originalNickname.current) {
      setIsNicknameChecked(true);
      toast.success('현재 닉네임 그대로 사용합니다.');
      return;
    }
    try {
      setIsChecking(true);
      const res = await apiCheckNickname({ nickName });
      if (res.isSuccess) {
        setIsNicknameChecked(true);
        toast.success(res.result || '사용 가능한 닉네임입니다.');
      } else {
        setIsNicknameChecked(false);
        toast.error(res.message || '사용할 수 없는 닉네임입니다.');
      }
    } catch (e) {
      setIsNicknameChecked(false);
      console.error('닉네임 확인 오류:', e);
      toast.error('닉네임 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  // 파일 선택 → 검증 → S3 업로드 → 미리보기 URL 반영
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { isValid, errorMessage } = validateImageFile(file);
    if (!isValid) {
      toast.error(errorMessage || '이미지 파일을 확인해 주세요.');
      return;
    }

    try {
      const res = await uploadImageToS3(file);
      if (res.isSuccess) {
        setProfileImage(res.result.imageUrl);
        toast.success('이미지를 업로드했어요.');
      } else {
        toast.error(res.message || '이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
      console.error('이미지 업로드 오류:', err);
      toast.error('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      // 같은 파일 다시 선택할 때도 onChange가 동작하도록 초기화
      if (e.target) e.target.value = '';
    }
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

  // 저장 가능 조건
  const canSave =
    !!nickName &&
    (nickName === originalNickname.current || isNicknameChecked) &&
    !isSaving;

  // 저장
  const handleSave = async () => {
    if (!canSave) {
      alert('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    // 변경된 항목만 보냄
    const payload: {
      nickName?: string;
      imageName?: string;
      imageUrl?: string;
      bio?: string;
    } = {};

    if (nickName !== originalNickname.current) {
      payload.nickName = nickName;
    }

    // 이미지 분기
    const isDefault = profileImage === initialState.profileImage;

    if (isDefault) {
      // 기본 이미지: URL은 생략 권장
      payload.imageName = 'default-profile.svg';
    } else if (/^https?:\/\//.test(profileImage)) {
      // 이미 URL(S3/외부 링크)
      const fileNameFromUrl = profileImage.split('/').pop() || 'profile.jpg';
      payload.imageName = fileNameFromUrl;
      payload.imageUrl = profileImage;
    } else if (profileImage.startsWith('data:image/')) {
      // 예외: 혹시 dataURL 상태가 남아있다면 저장 직전에 업로드하여 URL로 치환
      try {
        const blob = await (await fetch(profileImage)).blob();
        const file = new File([blob], 'profile.jpg', {
          type: blob.type || 'image/jpeg',
        });
        const up = await uploadImageToS3(file);
        if (!up.isSuccess) {
          toast.error(up.message || '이미지 업로드에 실패했습니다.');
          return;
        }
        payload.imageName = up.result.imageName;
        payload.imageUrl = up.result.imageUrl;
      } catch (e) {
        console.error('저장 직전 업로드 오류:', e);
        toast.error('이미지 처리 중 오류가 발생했습니다.');
        return;
      }
    }

    if (bio) payload.bio = bio.slice(0, MAX_BIO_LEN);

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
        originalNickname.current = nickName;
        setIsNicknameChecked(true);
        qc.invalidateQueries({ queryKey: ['myInfo'] });
      } else {
        toast.error(res.message || '수정에 실패했습니다.');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        '서버 오류가 발생했습니다.';
      console.error('updateMyProfile error:', err?.response || err);
      toast.error(`수정 실패: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white relative flex flex-col items-center px-6 pb-6 font-Pretendard">
      <BackHeader title="프로필 수정하기" />

      {/* fixed 헤더와 겹치지 않게 상단 여백 확보 */}
      <div
        aria-hidden
        style={{ height: 'calc(56px + env(safe-area-inset-top))' }}
      />

      {/* 파일 업로드 input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* 시각적 제목은 헤더로 대체 */}
      <h1 className="text-[24px] font-bold mb-8 text-center sr-only">
        프로필 수정하기
      </h1>

      {/* 프로필 이미지 + 연필(팝오버 트리거) */}
      <div className="relative mb-10">
        <img
          src={
            profileImage || initialState.profileImage || '/default-profile.svg'
          }
          alt="프로필 이미지"
          className="w-32 h-32 rounded-full object-cover"
          onError={({ currentTarget }) => {
            currentTarget.src = '/default-profile.svg';
          }}
        />

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
        <div className="flex items-center gap-4">
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

      {/* 한 줄 소개 */}
      <div className="w-full flex flex-col gap-2 mt-6 mb-8">
        <label className="text-[16px] font-medium">
          한 줄 소개 <span className="text-sm text-[#666666] ml-2">*선택</span>
        </label>
        <div>
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
