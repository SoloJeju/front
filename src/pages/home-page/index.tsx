import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Pin from '/src/assets/pin.svg';
import MoreArrow from '/src/assets/arrow-more.svg';
import RecommendPlace from '../../components/HomePage/RecommendPlace';
import RecentReviewCard from '../../components/HomePage/RecentReviewCard';
import useGetTodayRecommendedSpots from '../../hooks/home/useGetTodayRecommendedSpots';
import useGetLatestReviews from '../../hooks/home/useGetLatestReviews';
import RoomCard from '../../components/common/RoomCard/RoomCard';
import useGetRecommendedChatRooms from '../../hooks/home/useGetRecommendedChatRooms';
import { useNavigate } from 'react-router-dom';
import ExBanner1 from '/src/assets/banner-ex1.png';
import ExBanner2 from '/src/assets/banner-ex2.png';
import ExBanner3 from '/src/assets/banner-ex3.png';
import ExBanner4 from '/src/assets/banner-ex4.png';
import useGetMyInfo from '../../hooks/mypage/useGetMyInfo';
import useFCM from '../../hooks/alarm/useFCM';
import { useEffect } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { useProfileStore } from '../../stores/profile-store';

export default function HomePage() {
  // const { nickname, type: userType } = useProfileStore();

  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const { updateToken } = useFCM();

  useEffect(() => {
    if (accessToken) {
      updateToken();
    }
  }, [accessToken, updateToken]);

  const {
    data: myInfo,
    isLoading: isLoadingMyInfo,
    isError: isErrorMyInfo,
  } = useGetMyInfo();
  const userType = myInfo?.result.userType;
  const nickName = myInfo?.result.nickName;

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

  const commentType = () => {
    switch (userType) {
      case '감성 여유형':
        return '이번 주말엔 어떤 혼행이 어울릴까요?';
      case '탐험 모험형':
        return '발 닿는 대로 떠나볼 준비 되셨나요?';
      case '기록 관찰형':
        return '오늘도 혼자만의 시선으로 채워볼까요?';
      case '루트 집중형':
        return '딱 떨어지는 동선으로 짜인 계획이 필요하신가요?';
    }
  };

  const imojiType = () => {
    switch (userType) {
      case '감성 여유형':
        return '🌿';
      case '탐험 모험형':
        return '✨';
      case '기록 관찰형':
        return '☕';
      case '루트 집중형':
        return '🧭';
    }
  };

  const buttonType = () => {
    switch (userType) {
      case '감성 여유형':
        return ['조용한 감성 스팟 둘러보기', 'AI로 감성 위주 계획 짜기'];
      case '탐험 모험형':
        return ['랜덤 AI 코스 추천', '현재 인기 많은 동행방 둘러보기'];
      case '기록 관찰형':
        return ['포토 스팟 추천 둘러보기', '오늘의 혼행 후기들 보기'];
      case '루트 집중형':
        return ['효율 루트 AI 추천', '동선 중심 관광지 모아보기'];
    }
  };

  const handleClickFirstButton = () => {
    if (userType === '감성 여유형') {
      navigate('/search');
    } else if (userType === '탐험 모험형') {
      navigate('/plan');
    } else if (userType === '기록 관찰형') {
      navigate('/community');
    } else if (userType === '루트 집중형') {
      navigate('/plan');
    }
  };

  const handleClickSecondButton = () => {
    if (userType === '감성 여유형') {
      navigate('/plan');
    } else if (userType === '탐험 모험형') {
      navigate('/community', {
        state: {
          category: '동행방',
        },
      });
    } else if (userType === '기록 관찰형') {
      navigate('/community');
    } else if (userType === '루트 집중형') {
      navigate('/search');
    }
  };

  if (
    isPendingTodayRecommendedSpots ||
    isPendinLastestReviews ||
    isPendingRecommendedChatRooms ||
    isLoadingMyInfo
  ) {
    return <LoadingSpinner />;
  }

  if (
    isErrorTodayRecommendedSpots ||
    isErrorLastestReviews ||
    isErrorRecommendedChatRooms ||
    isErrorMyInfo
  ) {
    return <div>Error!!</div>;
  }

  return (
    <div className="flex flex-col flex-1">
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
              src={ExBanner1}
              alt="ex-place"
              className="w-full h-full object-contain rounded-2xl"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={ExBanner2}
              alt="ex-place"
              className="w-full h-full object-contain rounded-2xl"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={ExBanner3}
              alt="ex-place"
              className="w-full h-full object-contain rounded-2xl"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={ExBanner4}
              alt="ex-place"
              className="w-full h-full object-contain rounded-2xl"
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
              <span className="block">{nickName}님은</span> {userType}{' '}
              여행자예요
              {imojiType()}
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
              ? commentType()
              : '로그인 하면 더 많은 기능을 사용할 수 있어요!'}
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              className="flex gap-2 p-2 font-[pretendard] font-medium text-black text-sm border border-[#F78938] rounded-xl break-keep"
              onClick={handleClickFirstButton}
            >
              <img src={Pin} />
              {accessToken ? buttonType()?.[0] : '로그인 하러가기'}
            </button>
            <button
              type="button"
              className="flex gap-2 p-2 font-[pretendard] font-medium text-black text-sm border border-[#F78938] rounded-xl break-keep"
              onClick={handleClickSecondButton}
            >
              <img src={Pin} />
              {accessToken ? buttonType()?.[1] : '내 여행자 타입 확인하기'}
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
                typeId={spot.contentTypeId}
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
                typeId={review.contentTypeId}
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
