import { useState } from 'react';
import CategoryGroup from '../../components/common/Category/Category';
import PostCard from '../../components/common/PostCard';

const mockData = [
  {
    id: 1,
    type: '궁금해요',
    title: '혼자 성산일출봉 가도 괜찮을까요?',
    content: '저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??',
    commentNumber: 3,
    time: '3분 전',
    writer: '감귤',
    image: '/src/assets/ex-place.png',
  },
  {
    id: 2,
    type: '혼행꿀팁',
    title: '혼자 성산일출봉 가도 괜찮을까요?',
    content: '저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??저 혼자 성산일출봉 가려는데 혼자 가는 사람도 많나요? 괜찮을지 모르겠네요 분위기 어떰??',
    commentNumber: 3,
    time: '3분 전',
    writer: null,
    image: null,
  },
];

export default function CommunityPage() {
  const [selected, setSelected] = useState('전체');

  const filteredData = selected === '전체' ? mockData : mockData.filter((data) => data.type === selected);

  return (
    <>
      <CategoryGroup selected={selected} setSelected={setSelected} />
      <div className='flex flex-col gap-2 mt-4'>
        {/* 무한스크롤 처리 */}
        {filteredData.map((data) => (
          <PostCard key={data.id} id={data.id} type={data.type} title={data.title} content={data.content} commentNumber={data.commentNumber} time={data.time} writer={data.writer} image={data.image} />
        ))}
      </div>
    </>
  );
}
