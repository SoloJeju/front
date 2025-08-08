import { useState } from 'react';
import CategoryGroup from '../../components/common/Category/Category';
import PostCard from '../../components/common/PostCard';
import PostNone from '/src/assets/post-none.svg';
import Write from '/src/assets/write.svg';

const mockData = [
  {
    id: 1,
    type: '궁금해요',
    title: '혼자 성산일출봉 가도 괜찮을까요?',
    content:
      '저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??',
    commentNumber: 3,
    time: '3분 전',
    writer: '감귤',
    image: '/src/assets/ex-place.png',
  },
  {
    id: 2,
    type: '혼행꿀팁',
    title: '혼자 성산일출봉 가도 괜찮을까요?',
    content:
      '저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??',
    commentNumber: 3,
    time: '3분 전',
    writer: null,
    image: null,
  },
  {
    id: 3,
    type: '혼행꿀팁',
    title: '혼자 성산일출봉 가도 괜찮을까요?',
    content:
      '저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??',
    commentNumber: 3,
    time: '3분 전',
    writer: null,
    image: null,
  },
];

export default function CommunityPage() {
  const [selected, setSelected] = useState('전체');

  const filteredData =
    selected === '전체'
      ? mockData
      : mockData.filter((data) => data.type === selected);

  return (
    <>
      <CategoryGroup selected={selected} setSelected={setSelected} />

      {/* 무한스크롤 처리 */}
      {filteredData.length !== 0 ? (
        <div className="flex flex-col gap-2 mt-15 pb-10">
          {filteredData.map((data) => (
            <PostCard
              key={data.id}
              id={data.id}
              type={data.type}
              title={data.title}
              content={data.content}
              commentNumber={data.commentNumber}
              time={data.time}
              writer={data.writer}
              image={data.image}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <img src={PostNone} className="w-20 h-20" />
          <p className="font-[pretendard] font-medium text-[#B4B4B4]">
            게시글이 존재하지 않습니다
          </p>
        </div>
      )}

      <button
        type="button"
        className="fixed bottom-25 right-6 p-3 rounded-full bg-[#F78938] cursor-pointer"
      >
        <img src={Write} alt="게시글쓰기" />
      </button>
    </>
  );
}
