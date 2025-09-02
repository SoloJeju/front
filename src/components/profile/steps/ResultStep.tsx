// 모든 답변을 종합해서 보여주는 최종 결과 화면
import Button from '../../common/Button';
import { useProfileStore } from '../../../stores/profile-store';

export default function ResultStep() {
  const storeData = useProfileStore();

  const handleSubmit = () => {
    console.log('Submitting Profile Data:', storeData);
    alert('프로필 생성 완료!');
  };

  return (
    <div className="px-6 pb-6 flex flex-col min-h-screen items-center justify-center text-center">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-xl text-center mb-4 leading-snug">
          <span className="font-bold text-3xl">{storeData.nickName}</span> 님의
          <br />
          여행 성향은?
        </h2>
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full py-3 rounded-[10px] text-white bg-[#F78938]"
        variant="primary"
      >
        완료
      </Button>
    </div>
  );
}
