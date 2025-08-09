import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Pin from '/src/assets/pin.svg';
import ExamplePlace from '/src/assets/ex-place.png';
import MoreArrow from '/src/assets/arrow-more.svg';
import RecommendPlace from '../../components/HomePage/RecommendPlace';
import RecentReviewCard from '../../components/HomePage/RecentReviewCard';
import RoomCardList from '../../components/common/RoomCard/RoomCardList';

const exPlaceData = [
  {
    id: 1,
    name: '섭지코지',
    level: 'EASY',
  },
  {
    id: 2,
    name: '섭지코지',
    level: 'NORMAL',
  },
  {
    id: 3,
    name: '섭지코지',
    level: 'HARD',
  },
];

const exRecentReview = [
  {
    id: 1,
    name: '카페 더 조용한',
    comment: '혼자라서 더 잘 즐길 수 있었어요',
  },
  {
    id: 2,
    name: '카페 더 조용한',
    comment: '혼자라서 더 잘 즐길 수 있었어요',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 px-4">
      <div className="w-full h-60 relative">
        <Swiper
          loop={true}
          spaceBetween={10}
          pagination={{
            el: '.custom-pagination',
            clickable: true,
          }}
          autoplay={{ delay: 3000 }}
          modules={[Pagination, Autoplay]}
          className="rounded-2xl w-full h-full"
        >
          <SwiperSlide>
            <img
              src={ExamplePlace}
              alt="ex-place"
              className="w-full h-full object-cover rounded-2xl"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={ExamplePlace}
              alt="ex-place"
              className="w-full h-full object-cover rounded-2xl"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={ExamplePlace}
              alt="ex-place"
              className="w-full h-full object-cover rounded-2xl"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={ExamplePlace}
              alt="ex-place"
              className="w-full h-full object-cover rounded-2xl"
            />
          </SwiperSlide>
        </Swiper>

        {/* 슬라이드 하단 위에 겹쳐서 표시 */}
        <div className="custom-pagination w-full max-w-[480px] absolute bottom-4 z-100 flex justify-center gap-2" />
      </div>

      <main className="pt-10">
        <h2 className="mb-4 font-[pretendard] font-semibold text-2xl text-black break-keep">
          <span className="block">홍길동님은</span> 감성 여유형 여행자예요 🍃
        </h2>

        <section className="mb-8">
          <p className="mb-2 font-[pretendard] font-medium text-[#5D5D5D] break-keep">
            이번 주말엔 어떤 혼행이 어울릴까요?
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              className="flex gap-2 p-2 font-[pretendard] font-medium text-black text-sm border border-[#F78938] rounded-xl break-keep"
            >
              <img src={Pin} />
              조용한 감성 스팟 둘러보기
            </button>
            <button
              type="button"
              className="flex gap-2 p-2 font-[pretendard] font-medium text-black text-sm border border-[#F78938] rounded-xl break-keep"
            >
              <img src={Pin} />
              AI로 감성 위주 계획짜기
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="font-[pretendard] font-semibold text-black text-xl mb-4">
            오늘의 추천 장소 TOP 3 🔥
          </h3>

          <div className="flex justify-center gap-2">
            {exPlaceData.map((data) => (
              <RecommendPlace
                key={data.id}
                id={data.id}
                name={data.name}
                level={data.level}
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex justify-between mb-4">
            <h3 className="font-[pretendard] font-semibold text-black text-xl">
              최신 혼행 후기 👀
            </h3>
            <button
              type="button"
              className="flex gap-2 items-center font-[pretendard] font-medium text-[12px] text-[#F78938]"
            >
              더보기 <img src={MoreArrow} />
            </button>
          </div>
          <div className="flex gap-2">
            {exRecentReview.map((data) => (
              <RecentReviewCard
                key={data.id}
                id={data.id}
                name={data.name}
                comment={data.comment}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between mb-4">
            <h3 className="font-[pretendard] font-semibold text-black text-xl">
              지금 열려있는 동행방
            </h3>
            <button
              type="button"
              className="flex gap-2 items-center font-[pretendard] font-medium text-[12px] text-[#F78938]"
            >
              더보기 <img src={MoreArrow} />
            </button>
          </div>
          <RoomCardList />
        </section>
      </main>
    </div>
  );
}
