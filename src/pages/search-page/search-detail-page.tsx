import { useEffect, useState } from 'react';
import BackIcon from '../../assets/beforeArrow.svg?react';
import QuestionIcon from '../../assets/question.svg?react';
import MapIcon from '../../assets/mapPin.svg?react';
import ClockIcon from '../../assets/clock.svg?react';
import WebIcon from '../../assets/web.svg?react';
import TelIcon from '../../assets/tel.svg?react';
import InfoIcon from '../../assets/info.svg?react';
import RoomCardList from '../../components/common/RoomCard/RoomCardList';
import ReviewList from '../../components/SearchPage/ReviewList';
import ReviewStats from '../../components/SearchPage/ReviewStats';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Cart from '../../assets/cartIcon.svg?react';
import { addToCart } from '../../apis/cart';
import toast from 'react-hot-toast';
import { getTouristDetail } from '../../apis/tourist';
import type { BasicSpotDetail, IntroSoptDetail } from '../../types/tourist';
import { filterSpotType } from '../../utils/filterSpotType';
import useGetInfiniteSpotImages from '../../hooks/tourist/useGetInfiniteSpotImages';
import { useInView } from 'react-intersection-observer';
import useGetInfiniteReveiws from '../../hooks/tourist/useGetInfiniteReveiws';
import useGetChatRooms from '../../hooks/tourist/useGetChatRooms';
import PostNone from '/src/assets/post-none.svg';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ExImage from '../../assets/ex-place.svg';
import { useWriteReviewStore } from '../../stores/writereview-store';
import { useCreateRoomStore } from '../../stores/createroom-store';
import GyulIcon from '../../assets/gyul.svg?react';

interface SpotDetail {
  basic: BasicSpotDetail;
  intro: IntroSoptDetail;
  info: [];
  reviewTags: string[];
  difficulty: string;
  hasCompanionRoom: boolean;
}

export default function SearchDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const setReviewData = useWriteReviewStore((state) => state.setFormData);
  const setCreateRoomData = useCreateRoomStore((state) => state.setFormData);
  const contentTypeId = Number(location.state?.contentTypeId);
  const selectTab = location.state?.selectTab;
  const [activeTab, setActiveTab] = useState(selectTab ? selectTab : '홈');
  const contentId = Number(params.placeId) || location.state?.placeId || null;

  const tabs = [
    { label: '홈' },
    { label: '사진' },
    { label: '리뷰' },
    { label: '동행방' },
  ];

  const [showOverview, setShowOverview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [spotDetailData, setSpotDetailData] = useState<SpotDetail | null>(null);
  const [isLoadingDetailData, setIsLoadingDetailData] = useState(false);

  useEffect(() => {
    const fetchSpotDetailData = async () => {
      setIsLoadingDetailData(true);
      try {
        const res = await getTouristDetail(contentId, contentTypeId);

        if (res.isSuccess) {
          setSpotDetailData(res.result);
        }
      } catch (e) {
        console.log(e);
        toast.error('관광지 정보 로딩 실패! 잠시 후 다시 시도해주세용...');
      } finally {
        setIsLoadingDetailData(false);
      }
    };

    fetchSpotDetailData();
  }, [contentId, contentTypeId]);

  const {
    data: spotImages,
    isPending: isPendingImages,
    isError: isErrorImages,
    isFetching: isFetchingSpotImages,
    hasNextPage: hasNextSpotImages,
    fetchNextPage: fetchNextSpotImages,
  } = useGetInfiniteSpotImages(contentId);

  const { ref: imageRef, inView: imageInView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (imageInView && !isFetchingSpotImages && hasNextSpotImages) {
      fetchNextSpotImages();
    }
  }, [
    imageInView,
    isFetchingSpotImages,
    hasNextSpotImages,
    fetchNextSpotImages,
  ]);

  const {
    data: reviews,
    isFetching: isFetchingReviews,
    hasNextPage: hasNextReviews,
    isPending: isPendingReviews,
    isError: isErrorReviews,
    fetchNextPage: fetchNextReviews,
  } = useGetInfiniteReveiws(contentId);

  const { ref: reviewRef, inView: reviewInView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (reviewInView && !isFetchingReviews && hasNextReviews) {
      fetchNextReviews();
    }
  }, [reviewInView, isFetchingReviews, hasNextReviews, fetchNextReviews]);

  const {
    data: chatRooms,
    isPending: isPendingChatRooms,
    isError: isErrorChatRooms,
  } = useGetChatRooms(contentId);

  const handleAddCart = async () => {
    if (!contentId) {
      alert('유효한 장소 ID가 없습니다.');
      return;
    }
    try {
      const response = await addToCart(contentId);
      if (response.isSuccess) {
        alert("장바구니에 추가되었습니다!");
      }
    } catch (e: unknown) {
      console.error(e);
      const error = e as { response?: { data?: { message: string } } };
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  if (
    isLoadingDetailData ||
    isPendingImages ||
    isPendingReviews ||
    isPendingChatRooms
  ) {
    return <LoadingSpinner color={'#ffffff'} />;
  }

  if (isErrorImages || isErrorReviews || isErrorChatRooms) {
    return <div>Error!</div>;
  }

  return (
    <div>
      <div className="flex px-4 py-3 justify-between items-center border-b border-neutral-200">
        <button className="p-1 -ml-1" onClick={() => navigate('/search')}>
          <BackIcon className="w-6 h-6" />
        </button>
        <div className="text-[#262626] font-[Pretendard] text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">
          {spotDetailData?.basic.title}
        </div>
        <div className="w-7" />
      </div>

      <div className="relative w-full h-[240px] flex-shrink-0">
        <img
          src={
            spotDetailData?.basic.firstimage ||
            spotDetailData?.basic.firstimage2 ||
            ExImage
          }
          alt={spotDetailData?.basic.title || '이미지 없음'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <button
          className="absolute top-3 right-3 p-1 bg-black/40 rounded-full cursor-pointer z-10"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          <QuestionIcon className="w-6 h-6 text-white" />
        </button>

        {showPopup && (
          <div className="absolute top-12 right-3 flex flex-col items-center gap-1 p-4 rounded-[12px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)] z-10">
            <p className="text-black font-[Pretendard] text-[14px] font-normal leading-[18px]">
              해당 장소가 보이지 않나요?
            </p>
            <p className="text-black font-[Pretendard] text-[14px] font-normal leading-[18px]" onClick={()=>navigate('/inquiry')}>
              1:1 문의하기 (폐업/오류 신고)
            </p>
          </div>
        )}

        {spotDetailData?.basic.overview && (
          <div
            className="absolute top-44 right-3 z-30"
            onMouseEnter={() => setShowOverview(true)}
            onMouseLeave={() => setShowOverview(false)}
          >
            <div
              className="relative cursor-pointer"
              onClick={() => setShowOverview((prev) => !prev)}
            >
              <GyulIcon className="w-10 h-10" />
              {!showOverview && (
                <span className="absolute top-0 right-0 block h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500"></span>
                </span>
              )}
            </div>
            {showOverview && (
              <div className="absolute bottom-full right-0 mb-2 w-[260px]">
                <div className="relative rounded-lg border border-gray-300 bg-white p-3 shadow-lg">
                  <p className="max-h-[100px] overflow-y-auto font-['Pretendard'] text-[14px] leading-[18px] text-black">
                    {spotDetailData.basic.overview}
                  </p>
                  <div
                    className="absolute -bottom-[10px] right-[10px] h-0 w-0"
                    style={{
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderTop: '10px solid white',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="absolute left-0 right-0 bottom-3 drop-shadow-sm flex flex-col gap-2 px-6 py-6  font-[pretendard]">
          <p
            className={`w-fit px-1 py-0.5 font-bold text-[10px] rounded-sm   ${spotDetailData?.difficulty === 'EASY' ? 'text-[#006259] bg-[#C8F5DA]' : spotDetailData?.difficulty === 'MEDIUM' ? 'text-[#F78938] bg-[#FFEE8C]' : spotDetailData?.difficulty === 'HARD' ? 'text-[#FF3E3E] bg-[#FFBBBB]' : 'text-[#707070] bg-[#C2C6C4]'}`}
          >
            {spotDetailData?.difficulty === 'MEDIUM' ? 'NORMAL' : spotDetailData?.difficulty}
          </p>
          <div className="flex items-center gap-2">
            <h1 className="text-white font-Pretendard text-[20px] font-semibold leading-[22px]">
              {spotDetailData?.basic.title}
            </h1>
            <span className="text-[#F5F5F5] text-[12px] font-medium leading-[14px] tracking-[-0.24px]">
              {filterSpotType(spotDetailData?.basic.contenttypeid || '')}
            </span>
          </div>
          <p className="text-white font-Pretendard text-[14px] font-medium leading-[16px] tracking-[-0.28px]">
            {spotDetailData?.basic.addr1 || spotDetailData?.basic.addr2}
          </p>
        </div>
      </div>

      <nav className="px-2">
        <div className="flex justify-around">
          {tabs.map((t) => (
            <div
              key={t.label}
              className="flex justify-center items-center w-[98.25px] h-[48px] cursor-pointer relative"
              onClick={() => setActiveTab(t.label)}
            >
              <span
                className={
                  activeTab === t.label
                    ? 'text-neutral-900 font-[Pretendard] text-[14px] font-medium leading-[16px] tracking-[-0.28px]'
                    : 'text-[#666] font-[Pretendard] text-[14px] font-medium leading-[16px] tracking-[-0.28px]'
                }
              >
                {t.label}
              </span>
              {activeTab === t.label && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-full bg-[#F78938] rounded-full" />
              )}
            </div>
          ))}
        </div>
      </nav>

      <div className="p-6">
        {activeTab === '홈' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4" />
              <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                {spotDetailData?.basic.addr1 ||
                  spotDetailData?.basic.addr2 ||
                  '--'}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <ClockIcon className="w-4 h-4" />
                <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard] whitespace-pre-wrap">
                  오픈: {spotDetailData?.intro.opentimefood?.replace(/<br\s*\/?>/gi, '\n') || '--'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex-shrink-0" />
                <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard] whitespace-pre-wrap">
                  휴일: {spotDetailData?.intro.restdatefood?.replace(/<br\s*\/?>/gi, '\n') || '--'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <WebIcon className="w-4 h-4" />
              <div className="flex flex-col">
                {spotDetailData?.basic.homepage ? (
                  spotDetailData.basic.homepage.split('\n').map((url, index) => (
                    url.trim() && (
                      <a
                        key={index}
                        href={url.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#033C81] hover:underline font-[Pretendard] break-all"
                      >
                        {url.trim().replace(/<[^>]*>?/gm, '')}
                      </a>
                    )
                  ))
                ) : (
                  <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                    --
                  </p>
                )}
              </div>
            </div>
            {spotDetailData?.basic.tel && (
              <div className="flex items-center gap-2">
                <TelIcon className="w-4 h-4" />
                <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                  {spotDetailData?.basic.tel}
                </p>
              </div>
            )}
            {spotDetailData?.intro.parkingfood && (
              <div className="flex items-center gap-2">
                <InfoIcon className="w-4 h-4" />
                <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                  주차 {spotDetailData?.intro.parkingfood.replace(/<br\s*\/?>/gi, '\n') || '--'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === '사진' && (
          <>
            {spotImages.pages.flatMap((page, idx) => {
              const spotImage = page.result.images ?? [];
              const heights = ['h-40', 'h-48', 'h-60'];

              return spotImage.length > 0 ? (
                <div key={idx} className="columns-2 gap-2">
                  {spotImage.map((img, idx) => {
                    const heightClass =
                      heights[Math.floor(Math.random() * heights.length)];
                    return (
                      <div
                        key={idx}
                        className={`mb-2 rounded-lg overflow-hidden ${heightClass}`}
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.imageName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  key={idx}
                  className="pt-15 flex flex-col justify-center items-center w-full max-w-[480px] h-full"
                >
                  <img src={PostNone} className="w-20 h-20" />
                  <p className="font-[pretendard] font-medium text-[#B4B4B4]">
                    사진이 아직 없어요
                  </p>
                </div>
              );
            })}
            <div ref={imageRef}></div>
          </>
        )}

        {activeTab === '리뷰' && (
          <div className="flex flex-col items-start w-full flex-shrink-0">
            <div className="w-full pb-6 border-b-8 border-[#F5F5F5]">
              <h2 className="font-[Pretendard] text-[18px] font-semibold leading-[20px] tracking-[-0.36px]">
                <span className="text-[#F78938]">
                  {spotDetailData?.basic.title}
                </span>
                {" "}다녀오셨다면,
              </h2>
              <h2 className="mt-[4px] font-[Pretendard] text-[18px] font-semibold leading-[20px] tracking-[-0.36px]">
                짧은 리뷰로 여행의 기억을 남겨보세요!
              </h2>
              <button
                className="w-full mt-[16px] flex h-[48px] px-[12px] justify-center items-center flex-shrink-0 self-stretch rounded-[10px] bg-[#F78938] text-[#FFF] text-center font-[Pretendard] text-[16px] not-italic font-semibold leading-[22px]"
                onClick={() => {
                  if (spotDetailData && contentId && contentTypeId) {
                    setReviewData({
                      contentId: contentId,
                      spotName: spotDetailData.basic.title,
                      contentTypeId: contentTypeId,
                    });
                    navigate(`/write-review`);
                  } else {
                    toast.error('리뷰를 작성할 장소 정보가 유효하지 않습니다.');
                  }
                }}
              >
                리뷰 쓰기
              </button>
            </div>
            {reviews.pages.flatMap((page, idx) => {
              const reviewStats = page.result.spotAgg;
              return reviewStats.averageRating ? (
                <ReviewStats
                  key={idx}
                  easy={reviewStats.easyPct}
                  medium={reviewStats.mediumPct}
                  hard={reviewStats.hardPct}
                  topTags={reviewStats.topTags}
                />
              ) : (
                <div className="pt-15 flex flex-col justify-center items-center h-full w-full max-w-[480px]">
                  <img src={PostNone} className="w-20 h-20" />
                  <p className="font-[pretendard] font-medium text-[#B4B4B4]">
                    리뷰가 아직 없어요
                  </p>
                </div>
              );
            })}

            {!showAllReviews && (
              <button
                className="w-full max-w-[480px] mt-4 py-2 flex justify-center text-center text-[#F78938] font-[Pretendard] text-[16px] not-italic font-medium leading-[18px] tracking-[-0.32px]"
                onClick={() => setShowAllReviews(true)}
              >
                + 더보기
              </button>
            )}

            {showAllReviews && (
              <>
                {reviews?.pages.flatMap((page, idx) => {
                  const reivewList = page.result.reviews || [];
                  return <ReviewList key={idx} reviewList={reivewList} />;
                })}
                <div ref={reviewRef}></div>
              </>
            )}
          </div>
        )}

        {activeTab === '동행방' && (
          <div className="mt-1">
            <div className="pb-6">
              <p className="mb-[12px] text-black font-[Pretendard] text-[18px] not-italic font-semibold leading-[20px] tracking-[-0.36px]">
                지금 열려있는 동행방
              </p>
              {chatRooms.length > 0 ? (
                <RoomCardList chatRooms={chatRooms} />
              ) : (
                <div className="flex flex-col justify-center items-center h-full w-full max-w-[480px]">
                  <img src={PostNone} className="w-20 h-20" />
                  <p className="font-[pretendard] font-medium text-[#B4B4B4]">
                    현재 진행중인 동행방이 없어요
                  </p>
                </div>
              )}
            </div>
            <div className="w-full pt-6 pb-3 border-t-8 border-[#F5F5F5]">
              <h2 className="font-[Pretendard] text-[18px] font-semibold leading-[20px] tracking-[-0.36px]">
                원하시는 동행방이 없나요?
              </h2>
              <h2 className="mt-[4px] font-[Pretendard] text-[18px] font-semibold leading-[20px] tracking-[-0.36px]">
                새로운 동행방을 만들어보세요!
              </h2>
              <button
                className="w-full mt-[16px] flex h-[48px] px-[12px] justify-center items-center flex-shrink-0 self-stretch rounded-[10px] bg-[#F78938] text-[#FFF] text-center font-[Pretendard] text-[16px] not-italic font-semibold leading-[22px]"
                onClick={() => {
                  if (spotDetailData && contentId) {
                    setCreateRoomData({
                      contentId: contentId,
                      spotName: spotDetailData.basic.title,
                    });
                    navigate(`/create-room`);
                  } else {
                    toast.error('동행방을 개설할 장소 정보가 유효하지 않습니다.');
                  }
                }}
              >
                새 동행방 개설하기
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end p-6">
        <button
          type="button"
          className="fixed bottom-25 p-3 rounded-full bg-[#fffffd] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer"
          onClick={handleAddCart}
        >
          <Cart className="w-9 h-9" />
        </button>
      </div>
    </div>
  );
}