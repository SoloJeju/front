import BackHeader from '../../components/common/Headers/BackHeader';
import PostCard from '../../components/common/PostCard';
import PostNone from '/src/assets/post-none.svg';

import { useMyCommentedPosts } from '../../hooks/mypage/useMyCommentedPosts';
import type { Post } from '../../types/post';

const MyComments = () => {
  const { data, isLoading, error } = useMyCommentedPosts(0, 10); // page: 0, size: 10

  let list: Post[] = [];
  if (data?.result && 'content' in data.result) {
    list = data.result.content;
  }

  return (
    <div className="font-[Pretendard]">
      <header className="relative flex items-center justify-center p-4">
        <BackHeader title="내가 댓글 단 글" />
      </header>

      <main className="p-4 flex flex-col gap-4">
        {isLoading && <div>게시글을 불러오는 중...</div>}
        {error && <div>에러가 발생했습니다.</div>}

        {!isLoading &&
          !error &&
          (list.length > 0 ? (
            list.map((post) => (
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
            ))
          ) : (
            <div className="pt-40 text-center flex flex-col items-center text-gray-500">
              <img
                src={PostNone}
                alt="빈 상태"
                className="w-[170px] h-[102px] mb-4"
              />
              <p className="text-lg">댓글 단 글이 없어요.</p>
              <p className="mt-2 text-sm">관심 있는 글에 댓글을 남겨보세요!</p>
            </div>
          ))}
      </main>
    </div>
  );
};

export default MyComments;
