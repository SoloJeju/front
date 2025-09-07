import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후에 로그인 페이지로 이동하도록 설정
    const timer = setTimeout(() => {
      navigate('/login'); // 로그인 페이지나 메인 페이지 경로를 지정
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#F78938]">
      {/* 혹시 로고가 들어간다면 */}
    </div>
  );
}

export default SplashPage;
