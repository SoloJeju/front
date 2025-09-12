import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function KakaoCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
  const accessToken = searchParams.get('accessToken');
  const userId = searchParams.get('userId');
  const isProfileCompleted = searchParams.get('isProfileCompleted');
  const kakaoNickname = searchParams.get('kakaoNickname');

  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userId', userId || '');
    localStorage.setItem('isProfileCompleted', isProfileCompleted || 'false');
    localStorage.setItem('kakaoNickname', kakaoNickname || '');

    toast.success('카카오 로그인되었습니다.');
    // 프로필 입력 여부에 따라 분기
    if (isProfileCompleted === 'true') {
      navigate('/');
    } else {
      navigate('/signup?step=3');
    }
  } else {
    toast.error('로그인 정보를 받아오지 못했습니다.');
    navigate('/login');
  }
}, [searchParams, navigate]);


  return <div>로그인 처리 중...</div>;
}
