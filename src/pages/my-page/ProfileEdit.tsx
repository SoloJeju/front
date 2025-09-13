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
import axios from 'axios';
import useGetMyInfo from '../../hooks/mypage/useGetMyInfo';

const MAX_BIO_LEN = 25;
const DEFAULT_IMG = '/default-profile.svg';

const handleImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
  e.currentTarget.src = DEFAULT_IMG;
};

export default function ProfileEdit() {
  const { nickName, setNickName, profileImage, setProfileImage, bio, setBio } =
    useProfileStore();
  const qc = useQueryClient();

  const { data: myInfoResponse, isLoading, isError } = useGetMyInfo();

  const originalNickname = useRef(nickName);
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
    if (myInfoResponse?.result) {
      const profile = myInfoResponse.result;
      setNickName(profile.nickName || '');
      setBio(profile.bio || '');
      setProfileImage(profile.imageUrl || initialState.profileImage);
      originalNickname.current = profile.nickName || '';
    }
  }, [myInfoResponse, setNickName, setBio, setProfileImage]);

  useEffect(() => {
    setBioLen(bio ? Math.min(bio.length, MAX_BIO_LEN) : 0);
  }, [bio]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setIsProfileMenuOpen(false);
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
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

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setNickName(next);
    setIsNicknameChecked(next === originalNickname.current);
  };

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
    } catch (e: unknown) {
      setIsNicknameChecked(false);
      console.error('닉네임 확인 오류:', e);
      toast.error('닉네임 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

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
    } catch (err: unknown) {
      console.error('이미지 업로드 오류:', err);
      toast.error('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
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

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? '';
    const trimmed = v.slice(0, MAX_BIO_LEN);
    setBio(trimmed);
    setBioLen(trimmed.length);
  };

  const canSave =
    !!nickName &&
    (nickName === originalNickname.current || isNicknameChecked) &&
    !isSaving;

  const handleSave = async () => {
    if (!canSave) {
      toast.error('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    const originalProfile = myInfoResponse?.result;
    const payload: {
      nickName?: string;
      imageName?: string;
      imageUrl?: string;
      bio?: string;
    } = {};

    if (nickName !== originalProfile?.nickName) {
      payload.nickName = nickName;
    }

    if (profileImage !== originalProfile?.imageUrl) {
      const isDefault = profileImage === initialState.profileImage;
      if (isDefault) {
        payload.imageName = 'default-profile.svg';
        payload.imageUrl = '';
      } else if (profileImage) {
        payload.imageUrl = profileImage;
        payload.imageName = profileImage.split('/').pop() || 'profile.jpg';
      }
    }

    if (bio !== originalProfile?.bio) {
      payload.bio = bio.slice(0, MAX_BIO_LEN);
    }

    if (Object.keys(payload).length === 0) {
      toast('변경사항이 없습니다.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await updateMyProfile(payload);
      if (res.isSuccess) {
        toast.success('프로필이 수정되었습니다.');
        await qc.invalidateQueries({ queryKey: ['myProfile'] });
      } else {
        toast.error(res.message || '수정에 실패했습니다.');
      }
    } catch (err: unknown) {
      let msg = '서버 오류가 발생했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        msg = data?.message ?? err.message ?? msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(`수정 실패: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>프로필 정보를 불러오는 중...</div>;
  if (isError) return <div>오류가 발생하여 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="bg-white relative flex flex-col items-center px-6 pb-6 font-[Pretendard]">
      <BackHeader title="프로필 수정하기" />
      <div
        aria-hidden
        style={{ height: 'calc(56px + env(safe-area-inset-top))' }}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <h1 className="text-[24px] font-bold mb-8 text-center sr-only">
        프로필 수정하기
      </h1>
      <div className="relative mb-10">
        <img
          src={profileImage || initialState.profileImage || DEFAULT_IMG}
          alt="프로필 이미지"
          className="w-32 h-32 rounded-full object-cover"
          onError={handleImgError}
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
        {isProfileMenuOpen && (
          <div
            ref={menuRef}
            role="menu"
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-45 rounded-xl bg-white/90 backdrop-blur-sm ring-1 ring-black/5 shadow-md overflow-hidden z-10"
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
