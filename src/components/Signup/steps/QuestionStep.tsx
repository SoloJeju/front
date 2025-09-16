// 회원가입 5단계 - 5개의 모든 질문을 처리하는 재사용 가능한 질문 화면
import Button from '../../common/Button';

interface QuestionStepProps {
  question: string;
  options: string[];
  selectedValue: string;
  onSelect: (option: string) => void;
  onNext: () => void;
  step: number;
  totalSteps: number;
}

export default function QuestionStep({
  question,
  options,
  selectedValue,
  onSelect,
  onNext,
  step,
  totalSteps,
}: QuestionStepProps) {
  const isLastStep = step === totalSteps;
  const buttonText = isLastStep ? '시작하기' : '다음으로';

  return (
    <div className="flex flex-col min-h-screen font-[Pretendard] max-w-app mx-auto justify-between">
      <div>
        {/* 상단 UI */}
        <div className="flex justify-center space-x-1.5 pt-4">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx + 1 === step ? 'bg-[#F78938]' : 'bg-[#D9D9D9]'
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-center pt-12 mb-50 whitespace-pre-line">
          {question}
        </h2>

        {/* 선택지 버튼 */}
        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`
                w-full rounded-[20px] border border-[#F78938] p-4 text-center text-base font-medium
                transition-all duration-200
                ${
                  selectedValue === option
                    ? 'bg-[#F78938] text-white scale-105'
                    : 'bg-white text-[#000000]'
                }
                hover:bg-[#F78938] hover:text-white
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-12">
        <Button
          size="large"
          variant="primary"
          onClick={onNext}
          disabled={!selectedValue}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
