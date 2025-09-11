import BackHeader from '../../components/common/Headers/BackHeader';

const PrivacyPolicy = () => {
  return (
    <div className="font-[Pretendard]">
      <header className="relative flex items-center justify-center p-4">
        <BackHeader title="개인정보 처리방침" />
      </header>
      <main className="p-4">
        <p>개인정보 처리방침 내용이 여기에 들어갑니다.</p>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
