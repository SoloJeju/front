// 여행 성향 질문 시작을 알리는 인트로 화면
import Button from '../../common/Button';
import { useProfileStore } from '../../../stores/profile-store';

export default function IntroStep({ onNext }: { onNext: () => void }) {
  const nickname = useProfileStore((state) => state.nickname);

  return (
    <div className="max-w-app mx-auto p-6 flex flex-col min-h-screen items-center justify-center text-center">
      <div className="flex-grow flex flex-col items-center justify-center">
        <img
          src="/question-logo.svg"
          alt="여행 성향 질문 인트로 일러스트"
          className="w-70 h-70 mb-8"
        />
        <h2 className="text-xl text-center mb-4 leading-snug">
          <span className="font-bold text-3xl">{nickname}</span> 님만의
          <br />
          여행 성향을 알려주세요!
        </h2>
        <p className="text-[#939393]">
          답변은 AI 계획 추천과 홈 콘텐츠 개인화에 사용됩니다
        </p>
      </div>
      <Button
        onClick={onNext}
        className="w-full py-3 rounded-md text-white bg-[#F78938]"
        variant="primary"
      >
        시작하기
      </Button>
    </div>
  );
}
