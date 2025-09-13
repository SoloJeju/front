import { useState } from 'react';
import PostCard from '../../components/common/PostCard';
import PostNone from '/src/assets/post-none.svg';
import { useMyScraps } from '../../hooks/mypage/useMyScraps';
import type { ScrapItem } from '../../types/mypage';

const MyBookmarks = () => {
  const [page, setPage] = useState(0);
  const size = 10;

  const { data, isLoading, error } = useMyScraps(page, size);

  let list: ScrapItem[] = [];
  let totalPages = 1;

  if (data?.result) {
    if ('totalPages' in data.result) {
      list = data.result.content; 
      totalPages = data.result.totalPages;
    }
  }

  return (
    <div className="font-[Pretendard]">
      {/* 2. 게시글 목록 */}
      <main className="flex flex-col gap-4">
        {isLoading && <div>불러오는 중...</div>}
        {error && <div>에러가 발생했습니다.</div>}

        {!isLoading && !error && (list.length > 0 ? (
          <>
            {list.map((post) => (
              <PostCard
                key={post.postId}
                id={post.postId}
                type={'스크랩'} 
                title={post.title}
                content={''} 
                commentNumber={0} 
                time={post.createdAt ?? ''}
                writer={''} 
                image={post.thumbnailUrl ?? null}
              />
            ))}

            {/* 페이지네이션 버튼 */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page <= 0}
                className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
              >
                이전
              </button>
              <span>{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                disabled={page + 1 >= totalPages}
                className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </>
        ) : (
          <div className="pt-40 text-center flex flex-col items-center text-gray-500">
            <img
              src={PostNone}
              alt="빈 상태"
              className="w-[170px] h-[102px] mb-4"
            />
            <p className="text-lg">스크랩한 글이 없어요.</p>
            <p className="mt-2 text-sm">마음에 드는 글을 스크랩해보세요!</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default MyBookmarks;

