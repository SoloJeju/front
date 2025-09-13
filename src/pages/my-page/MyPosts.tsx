import { useEffect, useRef } from 'react';
import PostNone from '/src/assets/post-none.svg';
import PostCard from '../../components/common/PostCard';
import { useMyPosts } from '../../hooks/mypage/useMyPosts';

export default function MyPosts() {
  const size = 10;
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyPosts(size);

  const loader = useRef<HTMLDivElement | null>(null);
  const list = data?.pages.flatMap((p) => p.result.content) ?? [];
  const isEmpty = !isLoading && !error && list.length === 0;

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

  if (isLoading) return <div className="text-center pt-40">로딩 중...</div>;
  if (error)
    return <div className="text-center pt-40">오류가 발생했습니다.</div>;

  return (
    <div className="font-[Pretendard] bg-[#FFFFFD] min-h-screen flex justify-center">
      <div className="w-full max-w-[480px]">
        {isEmpty ? (
          <div className="pt-40 text-center flex flex-col items-center text-gray-500">
            <img
              src={PostNone}
              alt="빈 상태"
              className="w-[170px] h-[102px] mb-4"
            />
            <p className="text-lg">작성한 글이 없어요.</p>
            <p className="mt-2 text-sm">커뮤니티에 첫 글을 남겨보세요!</p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            {list.map((post) => (
              <PostCard
                key={post.postId}
                id={post.postId}
                type={post.postCategory}
                title={post.title}
                content={post.content}
                commentNumber={post.commentCount}
                time={post.createdAt.toString()}
                writer={post.authorNickname}
                image={post.thumbnailUrl}
              />
            ))}

            <div ref={loader} style={{ height: 50 }} />
            {isFetchingNextPage && (
              <p className="text-center p-4 text-[#F78937]">
                더 불러오는 중...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
