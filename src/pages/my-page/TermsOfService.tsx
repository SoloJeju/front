import BackHeader from '../../components/common/Headers/BackHeader';

const TermsOfService = () => {
  return (
    <div className="font-[Pretendard]">
      <header className="relative flex items-center justify-center p-4">
        <BackHeader title="서비스 이용약관" />
      </header>
      <main className="p-4 leading-relaxed">
        <section className="mb-4">
          <h2 className="font-bold mb-2">제1조 (목적)</h2>
          <p>내용...</p>
        </section>
        <section className="mb-4">
          <h2 className="font-bold mb-2">제2조 (용어 정의)</h2>
          <p>내용...</p>
        </section>
      </main>
    </div>
  );
};

export default TermsOfService;
