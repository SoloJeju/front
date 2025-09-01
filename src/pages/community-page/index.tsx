import { useEffect, useState } from 'react';
import CategoryGroup from '../../components/common/Category/Category';
import PostCard from '../../components/common/PostCard';
import PostNone from '/src/assets/post-none.svg';
import Write from '/src/assets/write.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import useGetInfinitePostList from '../../hooks/community/useGetInfinitePostList';
import { useInView } from 'react-intersection-observer';
import { filterCategoryKoToEn } from '../../utils/filterCategory';

export default function CommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;
  const [selected, setSelected] = useState(category ? category : '전체');

  const { data, isFetching, hasNextPage, isPending, isError, fetchNextPage } =
    useGetInfinitePostList(filterCategoryKoToEn(selected));

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  const handleNewPost = () => {
    navigate('/community/new-post');
  };

  if (isPending) {
    // loading ui
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Erorr</div>;
  }

  return (
    <>
      <CategoryGroup selected={selected} setSelected={setSelected} />

      {data?.pages.flatMap((page) => {
        const posts = page.result.content;

        return posts.length > 0 ? (
          posts.map((post) => (
            <div className="pt-5">
              <PostCard
                key={post.postId}
                id={post.postId}
                type={post.postCategory}
                title={post.title}
                content={post.content}
                commentNumber={post.commentCount}
                time={post.createdAt}
                writer={post.authorNickname}
                image={post.thumbnailUrl}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <img src={PostNone} className="w-20 h-20" />
            <p className="font-[pretendard] font-medium text-[#B4B4B4]">
              게시글이 존재하지 않습니다
            </p>
          </div>
        );
      })}

      <div ref={ref}></div>

      <div className="flex justify-end">
        <button
          type="button"
          className="fixed bottom-25 p-3 rounded-full bg-[#F78938] cursor-pointer"
          onClick={handleNewPost}
        >
          <img src={Write} alt="게시글쓰기" />
        </button>
      </div>
    </>
  );
}
