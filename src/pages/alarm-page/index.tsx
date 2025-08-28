import AlarmCard from '../../components/AlarmPage/AlarmCard';

const mockData = [
  {
    id: 1,
    type: '댓글',
    title: '게시글에 새로운 댓글이 달렸어요!',
    content: '밥은 먹고 다니냐 ...',
  },
  {
    id: 2,
    type: '메시지',
    title: '동행방에 새로운 메시지가 있어요!',
    content: '밥은 먹고 다니냐 ...',
  },
  {
    id: 3,
    type: '댓글',
    title: '게시글에 새로운 댓글이 달렸어요!',
    content: '밥은 먹고 다니냐 ...',
  },
  {
    id: 4,
    type: '댓글',
    title: '게시글에 새로운 댓글이 달렸어요!',
    content: '밥은 먹고 다니냐 ...',
  },
];

export default function AlarmPage() {
  return (
    <div className="flex flex-col gap-3 px-4">
      {/* 무한스크롤 처리 */}
      {mockData.map((data) => (
        <AlarmCard
          key={data.id}
          type={data.type}
          title={data.title}
          content={data.content}
        />
      ))}
    </div>
  );
}
