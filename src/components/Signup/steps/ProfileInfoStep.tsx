// 회원가입 3단계 - 기본 정보 입력 화면
import { useState, useRef, useEffect, useMemo } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useProfileStore } from '../../../stores/profile-store';
import { useProfile } from '../../../hooks/profile/useProfile';
import defaultProfile from '../../../assets/profileDefault.svg';
import editIcon from '../../../assets/edit-icon.svg';
import toast from 'react-hot-toast';
import {
  uploadImageToS3,
  validateImageFile,
  deleteImageFromS3,
} from '../../../apis/s3';

const MAX_BIO_LEN = 25;
const DEFAULT_PROFILE = defaultProfile;

const isValidYMD = (s: string, min = '1900-01-01', max?: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d)
    return false;
  if (s < min) return false;
  if (max && s > max) return false;
  return true;
};

export default function ProfileInfoStep({ onNext }: { onNext: () => void }) {
  const {
    name,
    setName,
    nickName,
    setNickName,
    gender,
    setGender,
    birthdate,
    setBirthdate,
    profileImage,
    setProfileImage,
    bio,
    setBio,
  } = useProfileStore();

  const { executeCheckNickname, isCheckingNickname } = useProfile();

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [bioLen, setBioLen] = useState<number>(bio ? bio.length : 0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    name: string;
    url: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setBioLen(bio ? Math.min(bio.length, MAX_BIO_LEN) : 0);
  }, [bio]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setIsProfileMenuOpen(false);
    const onClickOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
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

  const handleCheckNickname = () => {
    if (!nickName) return;
    executeCheckNickname(
      { nickName },
      {
        onSuccess: () => setIsNicknameChecked(true),
        onError: () => setIsNicknameChecked(false),
      }
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { isValid, errorMessage } = validateImageFile(file);
    if (!isValid) {
      toast.error(errorMessage || '유효하지 않은 파일입니다.');
      return;
    }

    try {
      if (uploadedImage?.name && profileImage === uploadedImage.url) {
        try {
          await deleteImageFromS3(uploadedImage.name);
        } catch (error) {
          console.error('S3 이전 이미지 삭제 실패(무시): ', error);
        }
      }

      const res = await uploadImageToS3(file);
      if (!res.isSuccess) {
        toast.error(res.message || '이미지 업로드에 실패했습니다.');
        return;
      }

      const { imageName, imageUrl } = res.result;
      setUploadedImage({ name: imageName, url: imageUrl });
      setProfileImage(imageUrl);
      toast.success('프로필 이미지가 변경되었습니다.');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '이미지 업로드 중 오류가 발생했습니다.');
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      closeProfileMenu();
    }
  };

  const handleUploadFromMenu = () => {
    fileInputRef.current?.click();
  };

  const handleResetToDefault = async () => {
    try {
      if (uploadedImage?.name && profileImage === uploadedImage.url) {
        await deleteImageFromS3(uploadedImage.name);
      }
      setUploadedImage(null);
      setProfileImage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('기본 이미지로 변경되었습니다.');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '이미지 삭제에 실패했습니다.');
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      closeProfileMenu();
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? '';
    const trimmed = v.slice(0, MAX_BIO_LEN);
    setBio(trimmed);
  };

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const birthIsValid = birthdate
    ? isValidYMD(birthdate, '1900-01-01', today)
    : false;

  const isDefaultImage =
    !uploadedImage &&
    (!profileImage ||
      profileImage === DEFAULT_PROFILE ||
      profileImage.startsWith('data:image'));

  const isFormValid =
    !!name && !!nickName && !!gender && birthIsValid && isNicknameChecked;

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

      <div className="relative mb-10">
        <img
          src={profileImage || DEFAULT_PROFILE}
          alt="프로필 이미지"
          className="w-32 h-32 rounded-full object-cover"
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
              onClick={handleResetToDefault}
              disabled={isDefaultImage}
              role="menuitem"
              className={`w-full text-left px-4 py-3 text-sm outline-none ${isDefaultImage ? 'text-[#262626]/40 cursor-default' : 'text-[#262626] hover:bg-gray-50 cursor-pointer'}`}
            >
              기본 이미지로 변경
            </button>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-4">
        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium">이름</label>
          <Input
            type="text"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium">닉네임</label>
          <Input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value);
              setIsNicknameChecked(false);
            }}
            endAdornment={
              <Button
                size="small"
                variant="primary"
                onClick={handleCheckNickname}
                disabled={!nickName || isCheckingNickname}
              >
                {isCheckingNickname ? '확인중...' : '중복확인'}
              </Button>
            }
          />
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
              className={`flex-1 py-2 rounded-[12px] border border-[#F78938] transition-colors duration-200 ${gender === '남자' ? 'bg-[#F78938] text-white' : 'bg-white text-[#5D5D5D]'} hover:bg-[#F78938] hover:text-white`}
              onClick={() => setGender('남자')}
            >
              남자
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-[12px] border border-[#F78938] transition-colors duration-200 ${gender === '여자' ? 'bg-[#F78938] text-white' : 'bg-white text-[#5D5D5D]'} hover:bg-[#F78938] hover:text-white`}
              onClick={() => setGender('여자')}
            >
              여자
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium">생년월일</label>
          <Input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            max={today}
            min="1900-01-01"
          />
          {birthdate && !birthIsValid && (
            <p className="text-xs text-red-500">
              YYYY-MM-DD 형식이거나 유효한 날짜로 입력해 주세요.
            </p>
          )}
        </div>

        {/* 한 줄 소개 */}
        <div className="flex flex-col gap-2 mb-8">
          <label className="text-[16px] font-medium">
            한 줄 소개{' '}
            <span className="text-sm text-[#666666] ml-2">*선택</span>
          </label>
          <Input
            type="text"
            placeholder="한 줄 소개를 입력해주세요"
            value={bio}
            onChange={handleBioChange}
            maxLength={MAX_BIO_LEN}
          />
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
          다음으로
        </Button>
      </div>
    </div>
  );
}
