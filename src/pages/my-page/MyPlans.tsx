import BackHeader from '../../components/common/Headers/BackHeader';
import PostNone from '/src/assets/post-none.svg';

export default function MyPlans() {
  return (
    <div className="font-Pretendard bg-[#FFFFFD] min-h-screen flex justify-center">
      <div className="w-full max-w-[480px]">
        {/* 헤더 */}
        <BackHeader title="나의 여행 계획" />

        {/* 콘텐츠 */}
        <div className="pt-40 text-center flex flex-col items-center text-gray-500">
          {/* 빈 상태 SVG */}
          <img
            src={PostNone}
            alt="빈 상태"
            className="w-[170px] h-[102px] mb-4"
          />

          {/* 안내 텍스트 */}
          <p className="text-lg">아직 여행 계획이 없네요!</p>
          <p className="mt-2 text-sm">새로운 여행을 계획해보세요.</p>
        </div>
      </div>
    </div>
  );
}
