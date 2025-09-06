// 회원가입 최종 컨트롤 페이지
import { useState, useEffect } from 'react';
import { useProfileStore } from '../../stores/profile-store';
import EmailStep from '../../components/Signup/steps/EmailStep';
import PasswordStep from '../../components/Signup/steps/PasswordStep';
import ProfileInfoStep from '../../components/Signup/steps/ProfileInfoStep';
import IntroStep from '../../components/Signup/steps/IntroStep';
import QuestionStep from '../../components/Signup/steps/QuestionStep';
import ResultStep from '../../components/Signup/steps/ResultStep';

const questions = [
  {
    question: '여행 중\n 가장 기대되는 순간은?',
    options: [
      '숨은 맛집을 발견했을 때',
      '아무도 없는 풍경을 마주할 때',
      '혼자만의 커피 타임',
      '즉흥적으로 어딘가 떠날 때',
    ],
    actionKey: 'setQ1',
    valueKey: 'q1_expect',
  },
  {
    question: '혼자 여행할 때,\n 나는 보통?',
    options: [
      '계획을 꽉 채운다',
      '루트만 정하고 느긋하게 움직인다',
      '발 닿는 대로 간다',
      '어딘가 한곳에 오래 머문다',
    ],
    actionKey: 'setQ2',
    valueKey: 'q2_habit',
  },
  {
    question: '여행에서\n 가장 피하고 싶은 것은?',
    options: [
      '북적거림과 시끌벅적한 분위기',
      '무계획의 불안함',
      '혼자 있는 눈치',
      '길 찾기 어려움',
    ],
    actionKey: 'setQ3',
    valueKey: 'q3_avoid',
  },
  {
    question: '혼자 여행할 때\n 주로 어떤 기분이 드나요?',
    options: [
      '혼자만의 시간이 편안하고 좋다',
      '괜히 두근거리고 설렌다',
      '주변 시선이 가끔 불편하다',
      '자유롭게 움직일 수 있어 좋다',
      '사진 찍거나 기록하는 걸 좋아한다',
    ],
    actionKey: 'setQ4',
    valueKey: 'q4_feeling',
  },
  {
    question: '혼자 여행에서\n 가장 필요하다고 느끼는건?',
    options: [
      '창 밖을 바라보며 멍 때릴 때',
      '낯선 골목을 걷는 순간',
      '마음에 드는 사진을 찍을 때',
      '그날의 계획을 정리할 때',
    ],
    actionKey: 'setQ5',
    valueKey: 'q5_necessity',
  },
];

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const store = useProfileStore();

  useEffect(() => {
    store.reset();
  }, []);

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EmailStep onNext={nextStep} />;
      case 2:
        return <PasswordStep onNext={nextStep} />;
      case 3:
        return <ProfileInfoStep onNext={nextStep} />;
      case 4:
        return <IntroStep onNext={nextStep} />;
      case 5:
      case 6:
      case 7:
      case 8:
      case 9: {
        const questionIndex = currentStep - 5;

        const q = questions[questionIndex];
        const onSelect = store[q.actionKey as keyof typeof store] as (
          value: string
        ) => void;
        const selectedValue = store[q.valueKey as keyof typeof store] as string;

        return (
          <QuestionStep
            question={q.question}
            options={q.options}
            selectedValue={selectedValue}
            onSelect={onSelect}
            onNext={nextStep}
            step={questionIndex + 1}
            totalSteps={questions.length}
          />
        );
      }
      case 10:
        return <ResultStep />;
      default:
        return <EmailStep onNext={nextStep} />;
    }
  };

  return <div className="max-w-app mx-auto">{renderStep()}</div>;
}
