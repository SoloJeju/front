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
import useGetTodayRecommendedSpots from '../../hooks/home/useGetTodayRecommendedSpots';
import useGetLatestReviews from '../../hooks/home/useGetLatestReviews';
import RoomCard from '../../components/common/RoomCard/RoomCard';
import useGetRecommendedChatRooms from '../../hooks/home/useGetRecommendedChatRooms';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const {
    data: todayRecommendedSpots,
    isPending: isPendingTodayRecommendedSpots,
    isError: isErrorTodayRecommendedSpots,
  } = useGetTodayRecommendedSpots();
  const {
    data: lastestReviews,
    isPending: isPendinLastestReviews,
    isError: isErrorLastestReviews,
  } = useGetLatestReviews();
  const {
    data: recommendedChatRooms,
    isPending: isPendingRecommendedChatRooms,
    isError: isErrorRecommendedChatRooms,
  } = useGetRecommendedChatRooms();

  const handleMoreChatRooms = () => {
    navigate(`/community`, {
      state: {
        category: '동행제안',
      },
    });
  };

  if (
    isPendingTodayRecommendedSpots ||
    isPendinLastestReviews ||
    isPendingRecommendedChatRooms
  ) {
    // loading ui
    return <div>Loading...</div>;
  }

  if (
    isErrorTodayRecommendedSpots ||
    isErrorLastestReviews ||
    isErrorRecommendedChatRooms
  ) {
    return <div>Error!!</div>;
  }

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
          {accessToken ? (
            <>
              <span className="block">홍길동님은</span> 감성 여유형 여행자예요
              🍃
            </>
          ) : (
            <>
              혼놀 관광지 추천부터 AI 일정 계획까지, "혼자옵서예"에서
              확인해보세요!
            </>
          )}
        </h2>

        <section className="mb-8">
          <p className="mb-2 font-[pretendard] font-medium text-[#5D5D5D] break-keep">
            {accessToken
              ? '이번 주말엔 어떤 혼행이 어울릴까요?'
              : '로그인하면 더 많은 기능을 사용할 수 있어요!'}
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              className="flex gap-2 p-2 font-[pretendard] font-medium text-black text-sm border border-[#F78938] rounded-xl break-keep"
            >
              <img src={Pin} />
              {accessToken ? '조용한 감성 스팟 둘러보기' : '로그인 하러가기'}
            </button>
            <button
              type="button"
              className="flex gap-2 p-2 font-[pretendard] font-medium text-black text-sm border border-[#F78938] rounded-xl break-keep"
            >
              <img src={Pin} />
              {accessToken
                ? 'AI로 감성 위주 계획짜기'
                : '내 여행자 타입 확인하기'}
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="font-[pretendard] font-semibold text-black text-xl mb-4">
            오늘의 추천 장소 TOP 3 🔥
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {todayRecommendedSpots?.map((spot) => (
              <RecommendPlace
                key={spot.contentId}
                id={spot.contentId}
                title={spot.title}
                image={spot.firstImage}
                level={spot.difficulty}
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex justify-between mb-4">
            <h3 className="font-[pretendard] font-semibold text-black text-xl">
              최신 혼행 후기 👀
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {lastestReviews?.map((review) => (
              <RecentReviewCard
                key={review.contentId}
                id={review.contentId}
                name={review.spotName}
                image={review.spotImage}
                comment={review.content}
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
              className="flex gap-2 items-center font-[pretendard] font-medium text-[12px] text-[#F78938] cursor-pointer"
              onClick={handleMoreChatRooms}
            >
              더보기 <img src={MoreArrow} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {recommendedChatRooms?.map((room) => (
              <RoomCard
                key={room.roomId}
                id={room.roomId}
                isEnd={room.currentParticipants === room.maxParticipants}
                title={room.title}
                location={room.spotName}
                date={room.scheduledDate}
                pre={room.currentParticipants}
                all={room.maxParticipants}
                imageUrl={room.spotImage}
                gender={room.genderRestriction}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
