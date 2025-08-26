import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import PostCard from '../../components/common/PostCard';
import PostNone from '/src/assets/post-none.svg';

const examplePosts = [
  {
    id: 1,
    type: '여행 정보',
    title: '제주도 동쪽 여행 코스 추천합니다!',
    content: '아이들과 함께 가기 좋은 코스와 맛집 정보를 정리했어요.',
    commentNumber: 4,
    time: '2시간 전',
    writer: '홍길동',
    image: null,
  },
  {
    id: 2,
    type: '맛집',
    title: '서귀포 흑돼지 맛집 다녀왔어요',
    content: '정말 맛있었던 흑돼지 집 후기 공유합니다.',
    commentNumber: 8,
    time: '1일 전',
    writer: '김철수',
    image: null,
  },
  {
    id: 3,
    type: '여행 후기',
    title: '한라산 등반 후기 (초보자 팁 포함)',
    content: '한라산 등반하면서 알게 된 팁과 주의사항을 공유합니다.',
    commentNumber: 11,
    time: '3일 전',
    writer: '이영희',
    image: null,
  },
];

const MyComments = () => {
  return (
    <div className="font-Pretendard">
      {/* 1. 상단 바 */}
      <header className="relative flex items-center justify-center p-4">
        <Link to="/my" className="absolute left-4">
          <IoIosArrowBack size={24} />
        </Link>
        <h1 className="text-lg font-bold">내가 댓글 단 글</h1>
      </header>

      {/* 2. 게시글 목록 */}
      <main className="p-4 flex flex-col gap-4">
        {examplePosts.length > 0 ? (
          examplePosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              type={post.type}
              title={post.title}
              content={post.content}
              commentNumber={post.commentNumber}
              time={post.time}
              writer={post.writer}
              image={post.image}
            />
          ))
        ) : (
          <div className="pt-40 text-center flex flex-col items-center text-gray-500">
            {/* 빈 상태 SVG */}
            <img
              src={PostNone}
              alt="빈 상태"
              className="w-[170px] h-[102px] mb-4"
            />

            {/* 안내 텍스트 */}
            <p className="text-lg">댓글 단 글이 없어요.</p>
            <p className="mt-2 text-sm">관심 있는 글에 댓글을 남겨보세요!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyComments;
