import { useEffect, useRef } from 'react';
import PostNone from '/src/assets/post-none.svg';
import ReviewCard from '../../components/MyPage/ReviewCard';
import useGetMyReviews from '../../hooks/mypage/useGetMyReview';

export default function MyReviews() {
  const loader = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useGetMyReviews();

  const reviews = data?.pages ?? [];
  const isEmpty = !isLoading && reviews.length === 0;

  useEffect(() => {
    if (!loader.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <div className="text-center pt-40">로딩 중...</div>;
  }

  if (isError) {
    return <div className="text-center pt-40">오류가 발생했습니다.</div>;
  }

  return (
    <div className="font-Pretendard bg-[#FFFFFD] min-h-screen flex justify-center">
      <div className="w-full max-w-[480px]">
        {isEmpty ? (
          <div className="pt-40 text-center flex flex-col items-center text-gray-500">
            <img src={PostNone} alt="빈 상태" className="w-[170px] h-[102px] mb-4" />
            <p className="text-lg">작성한 리뷰가 없어요.</p>
            <p className="mt-2 text-sm">첫 리뷰를 남겨보세요!</p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            <div ref={loader} style={{ height: 50 }} />
            {isFetchingNextPage && (
              <p className="text-center p-4 text-[#F78937]">더 불러오는 중...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}