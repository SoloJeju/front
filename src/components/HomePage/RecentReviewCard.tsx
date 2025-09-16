import { useNavigate } from 'react-router-dom';
import ExamplePlace from '/src/assets/ex-place.png';

interface RecentReviewCardProps {
  id: number;
  typeId: number;
  image?: string;
  name: string;
  comment: string | null;
}

const RecentReviewCard = ({
  id,
  typeId,
  image,
  name,
  comment = '',
}: RecentReviewCardProps) => {
  const navigate = useNavigate();

  const handleNavigateReview = () => {
    navigate(`search-detail/${id}`, {
      state: {
        selectTab: '리뷰',
        contentTypeId: typeId,
      },
    });
  };

  return (
    <figure className="relative cursor-pointer" onClick={handleNavigateReview}>
      <img
        src={image ? image : ExamplePlace}
        alt={name}
        className="h-[158px] rounded-xl brightness-75"
      />
      <figcaption className="absolute bottom-2 w-full flex flex-col p-3 pb-1">
        <div className="text-left">
          <p className="font-[pretendard] font-semibold text-[#ECECEC]">
            {name}
          </p>
          <p className="font-[pretendard] font-normal text-[12px] text-[#CBCBCB] line-clamp-2">
            {comment}
          </p>
        </div>
      </figcaption>
    </figure>
  );
};

export default RecentReviewCard;
