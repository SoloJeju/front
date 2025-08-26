import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

const PrivacyPolicy = () => {
  return (
    <div className="font-Pretendard">
      <header className="relative flex items-center justify-center p-4">
        <Link to="/my" className="absolute left-4">
          <IoIosArrowBack size={24} />
        </Link>
        <h1 className="text-lg font-bold">개인정보 처리방침</h1>
      </header>
      <main className="p-4">
        <p>개인정보 처리방침 내용이 여기에 들어갑니다.</p>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
