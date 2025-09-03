import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';
import PostDetailCard from '../../components/CommunityPage/PostDetailCard';
import CommentCard from '../../components/CommunityPage/CommentCard';
import Modal from '../../components/common/Modal';
import CommentInput from '../../components/CommunityPage/CommentInput';
import useGetPostDetail from '../../hooks/community/useGetPostDetail';
import useGetInfiniteCommentList from '../../hooks/community/useGetInfiniteCommentList';
import { useInView } from 'react-intersection-observer';
import useCreateComment from '../../hooks/community/useCreateComment';
import useDeleteComment from '../../hooks/community/useDeleteComment';

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
  const [comment, setComment] = useState('');
  const modalBg = useRef<HTMLDivElement | null>(null);

  const {
    data: postDetail,
    isPending: isPostDetailLoading,
    isError: isPostDetailError,
  } = useGetPostDetail(Number(postId));

  const {
    data: comments,
    isPending: isCommentLoading,
    isError: isCommentError,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteCommentList(Number(postId));

  const { mutate: createComment } = useCreateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

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

  const handleModifyPostDetail = () => {
    navigate(`/community/new-post`, {
      state: {
        postId: postDetail?.postId,
        title: postDetail?.title,
        content: postDetail?.content,
        category: postDetail?.postCategory,
        images: postDetail?.images,
      },
    });
  };

  const clickDeleteComment = () => {
    if (isDeleteCommentId) {
      deleteComment(isDeleteCommentId);
      setIsDeleteCommentId(null);
    }
  };

  const handleSubmitComment = () => {
    createComment({ postId: Number(postId), content: comment });
    setComment('');
  };

  if (isPostDetailLoading || isCommentLoading) {
    // loading ui
    return <div>Loading...</div>;
  }

  if (isPostDetailError || isCommentError) {
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
              chatRoomId={postDetail.chatRoomId}
              chatRoomTitle={postDetail.title}
              isEnd={postDetail.recruitmentStatus}
              location={postDetail.spotName}
              date={postDetail.joinDate}
              pre={postDetail.currentMembers}
              all={postDetail.maxMembers}
              chatRoomImage={postDetail.thumbnailUrl}
              chatRoomImageName={postDetail.thumbnailName}
              gender={postDetail.genderRestriction}
              ref={modalBg}
              onDelete={() => setIsDeletePostDetail(true)}
              onModify={handleModifyPostDetail}
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
          {comments?.pages.flatMap((data) => {
            const comment = data.result.content;

            return comment.map((c) => (
              <CommentCard
                key={c.commentId}
                id={c.commentId}
                author={c.authorNickname}
                authorId={c.authorId}
                image={c.authorProfileImage}
                time={c.createdAt}
                comment={c.content}
                isMine={c.isMine}
                ref={modalBg}
                isOpenMore={isOpenCommentId === c.commentId}
                setIsOpenMore={(id) => setIsOPenCommentId(id)}
                onDelete={(id) => setIsDeleteCommentId(id)}
                onReport={(id) => {
                  navigate(`/report?targetCommentId=${id}`);
                }}
              />
            ));
          })}

          <div ref={ref}></div>
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
                onClick: () => clickDeleteComment(),
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
