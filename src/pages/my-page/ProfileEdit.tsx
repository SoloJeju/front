import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useProfileStore, initialState } from '../../stores/profile-store';
import editIcon from '../../assets/edit-icon.svg';
import toast from 'react-hot-toast';
import { validateImageFile, uploadImageToS3 } from '../../apis/s3';
import useGetMyInfo from '../../hooks/mypage/useGetMyInfo';
import { useProfile } from '../../hooks/profile/useProfile';

const MAX_BIO_LEN = 25;
const DEFAULT_IMG = '/default-profile.svg';

const handleImgError: React.ReactEventHandler<HTMLImageElement> = (evt) => {
  evt.currentTarget.src = DEFAULT_IMG;
};

export default function ProfileEdit() {
  const { nickName, setNickName, profileImage, setProfileImage, bio, setBio } =
    useProfileStore();

  const navigate = useNavigate();

  const { data: myInfoResponse, isLoading, isError } = useGetMyInfo();

  const {
    executeCheckNickname,
    isCheckingNickname,
    executeUpdateProfile,
    isUpdatingProfile,
  } = useProfile();

  const originalNickname = useRef(nickName);
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [bioLen, setBioLen] = useState<number>(
    bio ? Math.min(bio.length, MAX_BIO_LEN) : 0
  );

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
    const onKey = (evt: KeyboardEvent) =>
      evt.key === 'Escape' && setIsProfileMenuOpen(false);
    const onClickOutside = (evt: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(evt.target as Node)) {
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

  const handleNicknameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const next = evt.target.value;
    setNickName(next);
    setIsNicknameChecked(next === originalNickname.current);
  };

  const handleCheckNickname = () => {
    if (!nickName) return;
    if (nickName === originalNickname.current) {
      toast.success('현재 닉네임 그대로 사용합니다.');
      setIsNicknameChecked(true);
      return;
    }

    executeCheckNickname(
      { nickName },
      {
        onSuccess: () => setIsNicknameChecked(true),
        onError: () => setIsNicknameChecked(false),
      }
    );
  };

  const handleFileChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
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
    } catch (error: unknown) {
      console.error('이미지 업로드 오류:', error);
      toast.error('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      if (evt.target) evt.target.value = '';
    }
  };

  const handleUploadFromMenu = () => {
    fileInputRef.current?.click();
    closeProfileMenu();
  };

  const handleResetToDefault = () => {
    setProfileImage('/default-profile.svg');
    if (fileInputRef.current) fileInputRef.current.value = '';
    closeProfileMenu();
  };

  const handleBioChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const v = evt.target.value ?? '';
    const trimmed = v.slice(0, MAX_BIO_LEN);
    setBio(trimmed);
    setBioLen(trimmed.length);
  };

  const defaultImageUrl = '/default-profile.svg';

  const originalProfile = myInfoResponse?.result;
  const hasNicknameChanged = nickName !== (originalProfile?.nickName ?? '');
  const hasBioChanged = (bio ?? '') !== (originalProfile?.bio ?? '');

  const hasImageChanged =
    (profileImage || defaultImageUrl) !==
    (originalProfile?.imageUrl || defaultImageUrl);
  const hasChanges = hasNicknameChanged || hasBioChanged || hasImageChanged;

  const canSave =
    hasChanges &&
    !!nickName &&
    (nickName === originalNickname.current || isNicknameChecked) &&
    !isUpdatingProfile;

  const handleSave = () => {
    if (!canSave) {
      if (!isNicknameChecked) {
        toast.error('닉네임 중복 확인을 완료해주세요.');
      }
      return;
    }

    const payload: {
      nickName?: string;
      imageName?: string;
      imageUrl?: string;
      bio?: string;
    } = {};

    if (hasNicknameChanged) payload.nickName = nickName;
    if (hasImageChanged) {
      const isDefault = profileImage === defaultImageUrl || !profileImage;
      if (isDefault) {
        payload.imageUrl = '/default-profile.svg';
        payload.imageName = 'default-profile.svg';
      } else if (profileImage) {
        payload.imageUrl = profileImage;
        payload.imageName = profileImage.split('/').pop() || 'profile.jpg';
      }
    }
    if (hasBioChanged) payload.bio = bio.slice(0, MAX_BIO_LEN);

    executeUpdateProfile(payload, {
      onSuccess: () => {
        navigate('/mypage');
      },
    });
  };

  if (isLoading) return <div>프로필 정보를 불러오는 중...</div>;
  if (isError) return <div>오류가 발생하여 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="bg-white relative flex flex-col items-center pb-6 font-[Pretendard]">
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
          src={profileImage || DEFAULT_IMG}
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
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-40 rounded-xl bg-white/90 backdrop-blur-sm ring-1 ring-black/5 shadow-md overflow-hidden z-10"
          >
            <button
              type="button"
              onClick={handleUploadFromMenu}
              role="menuitem"
              autoFocus
              className="w-full text-left px-4 py-3 text-sm text-[#262626] outline-none hover:bg-gray-50 cursor-pointer"
            >
              사진 변경
            </button>
            <div className="h-px bg-[#EDEDED]" />
            <button
              type="button"
              onClick={
                profileImage !== defaultImageUrl
                  ? handleResetToDefault
                  : undefined
              }
              disabled={profileImage === defaultImageUrl || !profileImage}
              role="menuitem"
              className={`w-full text-left px-4 py-3 text-sm outline-none ${
                profileImage === defaultImageUrl || !profileImage
                  ? 'text-[#262626]/40 cursor-default'
                  : 'text-[#262626] hover:bg-gray-50 cursor-pointer'
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
            disabled={!nickName || isCheckingNickname}
          >
            {isCheckingNickname ? '확인중…' : '중복확인'}
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
        {isUpdatingProfile ? '저장 중…' : '저장하기'}
      </Button>
    </div>
  );
}
