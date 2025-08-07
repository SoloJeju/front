import ExamplePlace from '/src/assets/ex-place.png';

interface RecentReviewCardProps {
  id: number;
  image?: string;
  name: string;
  comment: string;
}

const RecentReviewCard = ({ image, name, comment }: RecentReviewCardProps) => {
  return (
    <figure className='relative'>
      <img src={image ? image : ExamplePlace} alt={name} className='h-[158px] rounded-xl brightness-75' />
      <figcaption className='absolute bottom-2 w-full flex flex-col items-center'>
        <div className='text-left'>
          <p className='font-[pretendard] font-semibold text-[#ECECEC]'>{name}</p>
          <p className='font-[pretendard] font-normal text-[12px] text-[#CBCBCB]'>{comment}</p>
        </div>
      </figcaption>
    </figure>
  );
};

export default RecentReviewCard;
