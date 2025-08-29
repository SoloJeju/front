import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';
import PostDetailCard from '../../components/CommunityPage/PostDetailCard';
import CommentCard from '../../components/CommunityPage/CommentCard';
import Modal from '../../components/common/Modal';
import CommentInput from '../../components/CommunityPage/CommentInput';
import useGetPostDetail from '../../hooks/community/useGetPostDetail';

const commentData = [
  {
    id: 1,
    wrtier: '홍길동',
    time: '2025/01/01 14:52',
    comment:
      '안녕하세요!  혼놀 꿀팁 전문가입니다 ~ 혼자 성산일출봉에 가는 것이 고민이시군요..얼른 가시길..밥 든든히 먹고 가세요.. 배고픔.',
    image: null,
  },
  {
    id: 2,
    wrtier: '홍길동',
    time: '2025/01/01 14:52',
    comment: '저 좀 데려가주세요~~~~!!!!!',
    image: null,
  },
];

export default function PostDetailPage() {
  const params = useParams();
  const { postId } = params;
  const navigate = useNavigate();

  const [isOpenPostDetail, setIsOpenPostDetail] = useState(false);
  const [isOpenCommentId, setIsOPenCommentId] = useState<number | null>(null);
  const [isDeletePostDetail, setIsDeletePostDetail] = useState(false);
  const [isDeleteCommentId, setIsDeleteCommentId] = useState<number | null>(
    null
  );
  // const [isModifyCommentId, setIsModifyCommentId] = useState<number | null>(
  //   null
  // );
  // const [isReportCommentId, setIsReportCommentId] = useState<number | null>(
  //   null
  // );
  // const [isMine, setIsMine] = useState(true);
  const [comment, setComment] = useState('');
  const modalBg = useRef<HTMLDivElement | null>(null);

  const {
    data: postDetail,
    isPending: isPostDetailLoading,
    isError: isPostDetailError,
  } = useGetPostDetail(Number(postId));

  useEffect(() => {
    const handleModalBg = (e: MouseEvent) => {
      if (isOpenPostDetail || isOpenCommentId !== null) {
        if (modalBg.current && !modalBg.current.contains(e.target as Node)) {
          setIsOpenPostDetail(false);
          setIsOPenCommentId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleModalBg);

    return () => {
      document.removeEventListener('mousedown', handleModalBg);
    };
  });

  const handleSubmitComment = () => {
    console.log(comment);
    setComment('');
  };

  if (isPostDetailLoading) {
    // loading ui
    return <div>Loading...</div>;
  }

  if (isPostDetailError) {
    return <div>Erorr</div>;
  }

  return (
    <>
      <div className="min-h-screen pb-20">
        <div className="pb-4">
          {
            <PostDetailCard
              key={postDetail.postId}
              id={postDetail.postId}
              type={postDetail.postCategory}
              title={postDetail.title}
              content={postDetail.content}
              author={postDetail.authorNickname}
              authorId={postDetail.authorId}
              authorImage={postDetail.authorProfileImage}
              time={postDetail.updatedAt}
              images={postDetail.images}
              commentNumber={postDetail.commentCount}
              scriptNumber={postDetail.scrapCount}
              onClick={() => setIsOpenPostDetail(true)}
              isOpenMore={isOpenPostDetail}
              isMine={postDetail.isMine}
              isScraped={postDetail.isScraped}
              ref={modalBg}
              onDelete={() => setIsDeletePostDetail(true)}
              onModify={() => console.log('수정페이지 이동')}
              onReport={() => {
                navigate(`/report?targetPostId=${postDetail.postId}`);
              }}
            />
          }
        </div>
        {isDeletePostDetail && (
          <Modal
            title="삭제하시겠습니까?"
            children={<p>삭제한 내용은 복구되지 않습니다.</p>}
            buttons={[
              {
                text: '취소',
                onClick: () => setIsDeletePostDetail(false),
                variant: 'gray',
              },
              {
                text: '확인',
                onClick: () => console.log('삭제 실행'),
                variant: 'orange',
              },
            ]}
            onClose={() => setIsDeletePostDetail(false)}
          />
        )}

        <div className="flex flex-col gap-2 pl-5">
          {commentData.map((data) => (
            // 무한 스크롤 처리
            <CommentCard
              key={data.id}
              id={data.id}
              writer={data.wrtier}
              image={data.image}
              time={data.time}
              comment={data.comment}
              isMine={false}
              ref={modalBg}
              isOpenMore={isOpenCommentId === data.id}
              setIsOpenMore={(id) => setIsOPenCommentId(id)}
              onDelete={(id) => setIsDeleteCommentId(id)}
              onModify={(id) => console.log('수정페이지 이동', id)}
              onReport={(id) => {
                navigate(`/report?targetCommentId=${id}`);
              }}
            />
          ))}
        </div>
        {isDeleteCommentId && (
          <Modal
            title="삭제하시겠습니까?"
            children={<p>삭제한 내용은 복구되지 않습니다.</p>}
            buttons={[
              {
                text: '취소',
                onClick: () => setIsDeleteCommentId(null),
                variant: 'gray',
              },
              {
                text: '확인',
                onClick: () => console.log('삭제 실행'),
                variant: 'orange',
              },
            ]}
            onClose={() => setIsDeleteCommentId(null)}
          />
        )}
      </div>

      <CommentInput
        value={comment}
        onChange={setComment}
        onSubmit={handleSubmitComment}
      />
    </>
  );
}
